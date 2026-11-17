import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Uc as faUserGraduate, _c as faTrash, aa as faKey, bl as useApp, d as useTranslation, fr as faEdit, or as faDoorOpen, os as faSearch, ru as require_react, tl as faUsers, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Hostel/Hostel.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var HOSTEL_TYPES = [
	"Boys",
	"Girls",
	"Co-Education"
];
var ROOM_STATUSES = [
	"Available",
	"Occupied",
	"Under Maintenance",
	"Reserved"
];
var ALLOCATION_STATUSES = [
	"Active",
	"Checked Out",
	"Pending"
];
var initialHostelForm = {
	name: "",
	type: "",
	capacity: "",
	warden: ""
};
var initialRoomForm = {
	number: "",
	floor: "",
	capacity: "",
	type: "",
	status: "Available"
};
var initialAllocationForm = {
	student: "",
	room: "",
	bed: "",
	checkIn: "",
	status: "Active"
};
var initialVisitorForm = {
	name: "",
	student: "",
	room: "",
	phone: "",
	inTime: "",
	outTime: ""
};
var Hostel = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)({
		hostels: [],
		rooms: [],
		allocations: [],
		visitors: []
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("hostels");
	const [search, setSearch] = (0, import_react.useState)("");
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialHostelForm);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setData({
				hostels: [
					{
						id: 1,
						name: "Hostel A",
						type: "Boys",
						capacity: 200,
						warden: "Dr. Ali Khan"
					},
					{
						id: 2,
						name: "Hostel B",
						type: "Girls",
						capacity: 180,
						warden: "Ms. Sara Ali"
					},
					{
						id: 3,
						name: "Hostel C",
						type: "Boys",
						capacity: 150,
						warden: "Mr. Usman Raza"
					},
					{
						id: 4,
						name: "Hostel D",
						type: "Co-Education",
						capacity: 120,
						warden: "Dr. Fatima Noor"
					}
				],
				rooms: [
					{
						id: 1,
						number: "A-101",
						floor: 1,
						capacity: 3,
						occupied: 2,
						type: "Triple",
						status: "Available",
						hostel: "Hostel A"
					},
					{
						id: 2,
						number: "A-102",
						floor: 1,
						capacity: 2,
						occupied: 2,
						type: "Double",
						status: "Occupied",
						hostel: "Hostel A"
					},
					{
						id: 3,
						number: "B-201",
						floor: 2,
						capacity: 1,
						occupied: 1,
						type: "Single",
						status: "Occupied",
						hostel: "Hostel B"
					},
					{
						id: 4,
						number: "C-301",
						floor: 3,
						capacity: 4,
						occupied: 0,
						type: "Dormitory",
						status: "Available",
						hostel: "Hostel C"
					},
					{
						id: 5,
						number: "D-101",
						floor: 1,
						capacity: 2,
						occupied: 0,
						type: "Double",
						status: "Under Maintenance",
						hostel: "Hostel D"
					}
				],
				allocations: [
					{
						id: 1,
						student: "Ali Ahmed",
						room: "A-102",
						bed: "Bed 1",
						checkIn: "2026-01-15",
						status: "Active",
						hostel: "Hostel A"
					},
					{
						id: 2,
						student: "Sara Khan",
						room: "B-201",
						bed: "Bed 1",
						checkIn: "2026-02-01",
						status: "Active",
						hostel: "Hostel B"
					},
					{
						id: 3,
						student: "Usman Ali",
						room: "A-101",
						bed: "Bed 2",
						checkIn: "2026-03-10",
						status: "Active",
						hostel: "Hostel A"
					},
					{
						id: 4,
						student: "Hassan Raza",
						room: "A-102",
						bed: "Bed 2",
						checkIn: "2026-01-20",
						status: "Checked Out",
						hostel: "Hostel A"
					}
				],
				visitors: [{
					id: 1,
					name: "Ahmed Khan",
					student: "Ali Ahmed",
					room: "A-102",
					phone: "+92 300 1112233",
					inTime: "10:00 AM",
					outTime: "12:00 PM"
				}, {
					id: 2,
					name: "Fatima Noor",
					student: "Sara Khan",
					room: "B-201",
					phone: "+92 300 4455667",
					inTime: "2:00 PM",
					outTime: "5:00 PM"
				}]
			});
		} catch (err) {
			setError(err.message || "Failed to load data");
		} finally {
			setLoading(false);
		}
	};
	const getInitialForm = () => {
		if (activeTab === "hostels") return initialHostelForm;
		if (activeTab === "rooms") return initialRoomForm;
		if (activeTab === "allocations") return initialAllocationForm;
		return initialVisitorForm;
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData(getInitialForm());
		setShowModal(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		if (activeTab === "hostels") setFormData({
			name: item.name || "",
			type: item.type || "",
			capacity: item.capacity || "",
			warden: item.warden || ""
		});
		else if (activeTab === "rooms") setFormData({
			number: item.number || "",
			floor: item.floor || "",
			capacity: item.capacity || "",
			type: item.type || "",
			status: item.status || "Available"
		});
		else if (activeTab === "allocations") setFormData({
			student: item.student || "",
			room: item.room || "",
			bed: item.bed || "",
			checkIn: item.checkIn || "",
			status: item.status || "Active"
		});
		else setFormData({
			name: item.name || "",
			student: item.student || "",
			room: item.room || "",
			phone: item.phone || "",
			inTime: item.inTime || "",
			outTime: item.outTime || ""
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData[activeTab === "hostels" || activeTab === "visitors" ? "name" : activeTab === "rooms" ? "number" : "student"]) {
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
		if (activeTab === "hostels") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "small fw-bold text-muted mb-2",
						children: ["Hostel Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
						placeholder: "Hostel A"
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
						}), HOSTEL_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t,
							children: t
						}, t))]
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
						}),
						min: "1"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Warden"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.warden,
						onChange: (e) => setFormData({
							...formData,
							warden: e.target.value
						}),
						placeholder: "Dr. Ali Khan"
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
						}),
						placeholder: "A-101"
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
						}),
						min: "1"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Room Type"
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Single" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Double" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Triple" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Dormitory" })
						]
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
						children: ROOM_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))
					})]
				})
			]
		});
		if (activeTab === "allocations") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							children: "Select Student"
						})
					})]
				}),
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
							children: "Select Room"
						}), data.rooms.filter((r) => r.status === "Available").map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r.number,
							children: r.number
						}, r.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Bed Number"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.bed,
						onChange: (e) => setFormData({
							...formData,
							bed: e.target.value
						}),
						placeholder: "Bed 1"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Check-In Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						className: "form-control rounded-3",
						value: formData.checkIn,
						onChange: (e) => setFormData({
							...formData,
							checkIn: e.target.value
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
						children: ALLOCATION_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))
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
						}),
						placeholder: "Visitor name"
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
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-md-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "small fw-bold text-muted mb-2",
						children: "Student to Visit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.student,
						onChange: (e) => setFormData({
							...formData,
							student: e.target.value
						})
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
						children: "Out Time"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control rounded-3",
						value: formData.outTime,
						onChange: (e) => setFormData({
							...formData,
							outTime: e.target.value
						}),
						placeholder: "5:00 PM"
					})]
				})
			]
		});
	};
	const renderTable = () => {
		const list = data[activeTab] || [];
		if (activeTab === "hostels") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Capacity" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Warden" }),
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
								icon: faBuilding,
								className: "me-2 text-muted opacity-50"
							}), item.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "badge rounded-pill bg-info-subtle text-info",
							children: item.type
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.capacity
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.warden
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
		if (activeTab === "rooms") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
									children: "Room"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Floor" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Capacity" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Occupied" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
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
								icon: faDoorOpen,
								className: "me-2 text-muted opacity-50"
							}), item.number]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "small",
							children: ["Floor ", item.floor]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.capacity
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `fw-bold small ${item.occupied >= item.capacity ? "text-danger" : "text-success"}`,
									children: item.occupied
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress flex-grow-1",
									style: {
										height: "4px",
										width: "40px"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress-bar",
										style: {
											width: `${item.occupied / (item.capacity || 1) * 100}%`,
											background: item.occupied >= item.capacity ? "#ef4444" : "#10b981"
										}
									})
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.type
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `badge rounded-pill ${item.status === "Available" ? "bg-success-subtle text-success" : item.status === "Occupied" ? "bg-primary-subtle text-primary" : "bg-warning-subtle text-warning"}`,
							children: item.status
						}) }),
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
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "table-responsive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "table table-hover align-middle mb-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: `${isDark ? "bg-dark-subtle" : "bg-light"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
							children: activeTab === "allocations" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "ps-4",
									children: "Student"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Room" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Bed" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Check-In" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4 text-end",
									children: "Actions"
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "ps-4",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Student" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Room" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Phone" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "In Time" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Out Time" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4 text-end",
									children: "Actions"
								})
							] })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [activeTab === "allocations" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "ps-4 fw-semibold small",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faUserGraduate,
								className: "me-2 text-muted opacity-50"
							}), item.student]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.room
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.bed
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.checkIn
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `badge rounded-pill ${item.status === "Active" ? "bg-success-subtle text-success" : item.status === "Checked Out" ? "bg-secondary-subtle text-secondary" : "bg-warning-subtle text-warning"}`,
							children: item.status
						}) })
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "ps-4 fw-semibold small",
							children: item.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.student
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.room
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.inTime
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: item.outTime || "-"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
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
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Hostel Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage hostels, rooms, allocations, and visitors"
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
							activeTab === "hostels" ? "Hostel" : activeTab === "rooms" ? "Room" : activeTab === "allocations" ? "Allocation" : "Visitor"
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "nav nav-pills mb-4 gap-2",
				children: [
					{
						key: "hostels",
						label: "Hostels",
						icon: faBuilding
					},
					{
						key: "rooms",
						label: "Rooms",
						icon: faDoorOpen
					},
					{
						key: "allocations",
						label: "Allocations",
						icon: faKey
					},
					{
						key: "visitors",
						label: "Visitors",
						icon: faUsers
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
									activeTab === "hostels" ? "Hostel" : activeTab === "rooms" ? "Room" : activeTab === "allocations" ? "Allocation" : "Visitor"
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
export { Hostel as default };
