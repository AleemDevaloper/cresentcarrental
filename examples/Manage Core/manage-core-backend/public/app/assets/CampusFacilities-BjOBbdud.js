import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Pt as faCalendarCheck, _c as faTrash, bl as useApp, d as useTranslation, fr as faEdit, gl as faWrench, or as faDoorOpen, os as faSearch, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Campus/CampusFacilities.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var initialBuildingForm = {
	name: "",
	code: "",
	floors: "",
	type: "",
	facilities: ""
};
var initialRoomForm = {
	number: "",
	building: "",
	floor: "",
	capacity: "",
	type: "",
	equipment: "",
	status: "Available"
};
var initialBookingForm = {
	room: "",
	purpose: "",
	bookedBy: "",
	date: "",
	time: "",
	status: "Confirmed"
};
var initialWorkOrderForm = {
	title: "",
	room: "",
	type: "",
	priority: "",
	assignedTo: "",
	status: "Open",
	description: ""
};
var CampusFacilities = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)({
		buildings: [],
		rooms: [],
		bookings: [],
		maintenance: []
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("buildings");
	const [search, setSearch] = (0, import_react.useState)("");
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialBuildingForm);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setData({
				buildings: [
					{
						id: 1,
						name: "Academic Block",
						code: "AB",
						floors: 5,
						type: "Academic",
						facilities: "Elevator, AC, WiFi"
					},
					{
						id: 2,
						name: "Science Building",
						code: "SB",
						floors: 4,
						type: "Lab",
						facilities: "Labs, Auditorium"
					},
					{
						id: 3,
						name: "Library Block",
						code: "LB",
						floors: 3,
						type: "Library",
						facilities: "Reading Rooms, Digital Lab"
					},
					{
						id: 4,
						name: "Admin Building",
						code: "AD",
						floors: 2,
						type: "Administrative",
						facilities: "Offices, Meeting Rooms"
					}
				],
				rooms: [
					{
						id: 1,
						number: "AB-101",
						building: "Academic Block",
						floor: 1,
						capacity: 40,
						type: "Classroom",
						equipment: "Projector, Whiteboard",
						status: "Available"
					},
					{
						id: 2,
						number: "SB-201",
						building: "Science Building",
						floor: 2,
						capacity: 25,
						type: "Lab",
						equipment: "Computers, Microscopes",
						status: "In Use"
					},
					{
						id: 3,
						number: "AB-301",
						building: "Academic Block",
						floor: 3,
						capacity: 80,
						type: "Lecture Hall",
						equipment: "Smart Board, Sound System",
						status: "Available"
					},
					{
						id: 4,
						number: "LB-001",
						building: "Library Block",
						floor: 1,
						capacity: 100,
						type: "Hall",
						equipment: "Projector, Stage",
						status: "Under Maintenance"
					}
				],
				bookings: [
					{
						id: 1,
						room: "AB-101",
						purpose: "AI Workshop",
						bookedBy: "Dr. Ali",
						date: "2026-07-28",
						time: "10:00-12:00",
						status: "Confirmed"
					},
					{
						id: 2,
						room: "SB-201",
						purpose: "Physics Lab",
						bookedBy: "Prof. Sara",
						date: "2026-07-28",
						time: "14:00-16:00",
						status: "Confirmed"
					},
					{
						id: 3,
						room: "AB-301",
						purpose: "Guest Lecture",
						bookedBy: "Admin",
						date: "2026-07-29",
						time: "09:00-11:00",
						status: "Pending"
					}
				],
				maintenance: [
					{
						id: 1,
						title: "AC Not Working",
						room: "AB-101",
						type: "HVAC",
						priority: "High",
						assignedTo: "Tech Team A",
						status: "In Progress",
						description: "AC unit not cooling"
					},
					{
						id: 2,
						title: "Light Replacement",
						room: "SB-201",
						type: "Electrical",
						priority: "Low",
						assignedTo: "Tech Team B",
						status: "Open",
						description: "Tube light fuse"
					},
					{
						id: 3,
						title: "Water Leakage",
						room: "AB-301",
						type: "Plumbing",
						priority: "Urgent",
						assignedTo: "Tech Team A",
						status: "Open",
						description: "Ceiling leak near window"
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
		if (activeTab === "buildings") return initialBuildingForm;
		if (activeTab === "rooms") return initialRoomForm;
		if (activeTab === "bookings") return initialBookingForm;
		return initialWorkOrderForm;
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData(getInitialForm());
		setShowModal(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		if (activeTab === "buildings") setFormData({
			name: item.name || "",
			code: item.code || "",
			floors: item.floors || "",
			type: item.type || "",
			facilities: item.facilities || ""
		});
		else if (activeTab === "rooms") setFormData({
			number: item.number || "",
			building: item.building || "",
			floor: item.floor || "",
			capacity: item.capacity || "",
			type: item.type || "",
			equipment: item.equipment || "",
			status: item.status || "Available"
		});
		else if (activeTab === "bookings") setFormData({
			room: item.room || "",
			purpose: item.purpose || "",
			bookedBy: item.bookedBy || "",
			date: item.date || "",
			time: item.time || "",
			status: item.status || "Confirmed"
		});
		else setFormData({
			title: item.title || "",
			room: item.room || "",
			type: item.type || "",
			priority: item.priority || "",
			assignedTo: item.assignedTo || "",
			status: item.status || "Open",
			description: item.description || ""
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData[activeTab === "buildings" ? "name" : activeTab === "rooms" ? "number" : activeTab === "bookings" ? "purpose" : "title"]) {
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
	const getModalForm = () => {
		if (activeTab === "buildings") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Building Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
						children: "Code"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.code,
						onChange: (e) => setFormData({
							...formData,
							code: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Floors"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "form-control rounded-3",
						value: formData.floors,
						onChange: (e) => setFormData({
							...formData,
							floors: Number(e.target.value)
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Academic" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Lab" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Library" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Administrative" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Facilities"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.facilities,
						onChange: (e) => setFormData({
							...formData,
							facilities: e.target.value
						})
					})]
				})
			]
		});
		if (activeTab === "rooms") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Room Number ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Building"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.building,
						onChange: (e) => setFormData({
							...formData,
							building: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), data.buildings.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: b.name,
							children: b.name
						}, b.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Floor"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "form-control rounded-3",
						value: formData.floor,
						onChange: (e) => setFormData({
							...formData,
							floor: Number(e.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Classroom" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Lab" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Lecture Hall" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Office" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Hall" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.status,
						onChange: (e) => setFormData({
							...formData,
							status: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Available" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "In Use" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Under Maintenance" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Equipment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.equipment,
						onChange: (e) => setFormData({
							...formData,
							equipment: e.target.value
						}),
						placeholder: "Projector, Whiteboard, etc."
					})]
				})
			]
		});
		if (activeTab === "bookings") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Room"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.room,
						onChange: (e) => setFormData({
							...formData,
							room: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), data.rooms.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r.number,
							children: r.number
						}, r.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Purpose ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-danger",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						required: true,
						value: formData.purpose,
						onChange: (e) => setFormData({
							...formData,
							purpose: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Booked By"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.bookedBy,
						onChange: (e) => setFormData({
							...formData,
							bookedBy: e.target.value
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
						children: "Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.status,
						onChange: (e) => setFormData({
							...formData,
							status: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Confirmed" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Pending" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Cancelled" })
						]
					})]
				})
			]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
						children: "Priority"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select rounded-3",
						value: formData.priority,
						onChange: (e) => setFormData({
							...formData,
							priority: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Low" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Medium" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "High" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Urgent" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Room"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.room,
						onChange: (e) => setFormData({
							...formData,
							room: e.target.value
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Electrical" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Plumbing" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "HVAC" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Structural" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Assigned To"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.assignedTo,
						onChange: (e) => setFormData({
							...formData,
							assignedTo: e.target.value
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
	};
	const getStatusBadge = (status) => {
		const map = {
			Available: "bg-success-subtle text-success",
			In_Use: "bg-primary-subtle text-primary",
			Under_Maintenance: "bg-warning-subtle text-warning",
			Confirmed: "bg-success-subtle text-success",
			Pending: "bg-warning-subtle text-warning",
			Cancelled: "bg-danger-subtle text-danger",
			Open: "bg-info-subtle text-info",
			In_Progress: "bg-primary-subtle text-primary"
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge rounded-pill ${map[status] || map[status.replace(" ", "_")] || "bg-secondary-subtle text-secondary"}`,
			children: status
		});
	};
	const getPriorityBadge = (p) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge rounded-pill ${{
				Urgent: "bg-danger text-white",
				High: "bg-warning text-dark",
				Medium: "bg-info text-white",
				Low: "bg-secondary text-white"
			}[p] || ""}`,
			children: p
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Campus Facilities"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage buildings, rooms, bookings, and maintenance"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPlus,
							className: "me-2"
						}),
						"Add ",
						activeTab === "buildings" ? "Building" : activeTab === "rooms" ? "Room" : activeTab === "bookings" ? "Booking" : "Work Order"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "nav nav-pills mb-4 gap-2",
				children: [
					{
						key: "buildings",
						label: "Buildings",
						icon: faBuilding
					},
					{
						key: "rooms",
						label: "Rooms",
						icon: faDoorOpen
					},
					{
						key: "bookings",
						label: "Bookings",
						icon: faCalendarCheck
					},
					{
						key: "maintenance",
						label: "Maintenance",
						icon: faWrench
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
									activeTab === "buildings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Code" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Floors" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Facilities" })
									] }),
									activeTab === "rooms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Room"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Building" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Floor" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Capacity" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Equipment" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
									] }),
									activeTab === "bookings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Room"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Purpose" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Booked By" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Time" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
									] }),
									activeTab === "maintenance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "ps-4",
											children: "Title"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Room" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Priority" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Assigned To" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data[activeTab] || []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							activeTab === "buildings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "ps-4 fw-semibold small",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faBuilding,
										className: "me-2 text-muted opacity-50"
									}), item.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: item.code })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.floors
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.facilities
								})
							] }),
							activeTab === "rooms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "ps-4 fw-semibold small",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faDoorOpen,
										className: "me-2 text-muted opacity-50"
									}), item.number]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.building
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.floor
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.capacity
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small text-muted",
									children: item.equipment
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) })
							] }),
							activeTab === "bookings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "ps-4 fw-semibold small",
									children: item.room
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.purpose
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.bookedBy
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.time
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) })
							] }),
							activeTab === "maintenance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "ps-4 fw-semibold small",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.room
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getPriorityBadge(item.priority) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small",
									children: item.assignedTo
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status) })
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
									activeTab === "buildings" ? "Building" : activeTab === "rooms" ? "Room" : activeTab === "bookings" ? "Booking" : "Work Order"
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
export { CampusFacilities as default };
