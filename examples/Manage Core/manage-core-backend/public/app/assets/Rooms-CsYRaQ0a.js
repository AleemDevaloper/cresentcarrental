import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Gt as faChalkboard, Qn as faDesktop, _c as faTrash, bl as useApp, da as faLayerGroup, fr as faEdit, ml as faWind, or as faDoorOpen, os as faSearch, ru as require_react, tl as faUsers, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { I as listBuildings, T as deleteRoom, W as listRooms, f as createRoom, it as updateRoom } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Institution/Rooms.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ROOM_TYPES = [
	"Classroom",
	"Lab",
	"Office",
	"Lecture Hall",
	"Seminar Room",
	"Library",
	"Auditorium",
	"Conference Room",
	"Studio",
	"Other"
];
var RESOURCE_OPTIONS = [
	"Projector",
	"SmartBoard",
	"AC",
	"WiFi",
	"Computer Lab",
	"Audio System",
	"Video Conferencing"
];
var Rooms = () => {
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [buildings, setBuildings] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [buildingFilter, setBuildingFilter] = (0, import_react.useState)("");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("");
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		room_number: "",
		name: "",
		building_id: "",
		floor: "",
		capacity: "",
		room_type: "Classroom",
		resources: "",
		status: "active"
	});
	const fetchData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (search) params.search = search;
			if (buildingFilter) params.building_id = buildingFilter;
			if (typeFilter) params.room_type = typeFilter;
			if (statusFilter) params.status = statusFilter;
			const [roomRes, bldgRes] = await Promise.all([listRooms(params), listBuildings()]);
			setData(Array.isArray(roomRes) ? roomRes : []);
			setBuildings(Array.isArray(bldgRes) ? bldgRes : []);
		} catch (err) {
			setError(err.message || "Failed to load rooms");
			addNotification?.(err.message || "Failed to load rooms", "danger");
		} finally {
			setLoading(false);
		}
	}, [
		search,
		buildingFilter,
		typeFilter,
		statusFilter,
		addNotification
	]);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [fetchData]);
	const getBuildingName = (id) => {
		const b = buildings.find((bldg) => bldg.id === id);
		return b ? b.name : "Unknown";
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData({
			room_number: "",
			name: "",
			building_id: buildings[0]?.id || "",
			floor: "",
			capacity: "",
			room_type: "Classroom",
			resources: "",
			status: "active"
		});
		setShowForm(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		setFormData({
			room_number: item.room_number || "",
			name: item.name || "",
			building_id: item.building_id || buildings[0]?.id || "",
			floor: item.floor ?? "",
			capacity: item.capacity ?? "",
			room_type: item.room_type || "Classroom",
			resources: Array.isArray(item.resources) ? item.resources.join(", ") : item.resources || "",
			status: item.status || "active"
		});
		setShowForm(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.room_number) {
			addNotification?.("Room Number is required", "warning");
			return;
		}
		try {
			if (editItem) {
				await updateRoom(editItem.id, formData);
				addNotification?.("Room updated successfully", "success");
			} else {
				await createRoom(formData);
				addNotification?.("Room created successfully", "success");
			}
			setShowForm(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving room", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this room?")) return;
		try {
			await deleteRoom(id);
			addNotification?.("Room deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	const toggleResource = (res) => {
		const current = formData.resources ? formData.resources.split(",").map((s) => s.trim()).filter(Boolean) : [];
		const idx = current.indexOf(res);
		if (idx >= 0) current.splice(idx, 1);
		else current.push(res);
		setFormData({
			...formData,
			resources: current.join(", ")
		});
	};
	const selectedResources = formData.resources ? formData.resources.split(",").map((s) => s.trim()).filter(Boolean) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Rooms"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage rooms and facilities"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "Add Room"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
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
									placeholder: "Search rooms...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: buildingFilter,
								onChange: (e) => setBuildingFilter(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Buildings"
								}), buildings.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: b.id,
									children: b.name
								}, b.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: typeFilter,
								onChange: (e) => setTypeFilter(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Types"
								}), ROOM_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t,
									children: t
								}, t))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: statusFilter,
								onChange: (e) => setStatusFilter(e.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "active",
										children: "Active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "inactive",
										children: "Inactive"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-outline-secondary rounded-3 w-100",
								onClick: () => {
									setSearch("");
									setBuildingFilter("");
									setTypeFilter("");
									setStatusFilter("");
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Building" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Floor" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Capacity" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Resources" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "9",
							className: "text-center py-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
						}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "9",
							className: "text-center py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faDoorOpen,
									className: "fs-1 text-muted opacity-50 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									children: "No rooms found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Add a new room to get started"
								})
							]
						}) }) : data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faDoorOpen,
										className: "text-success opacity-50"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "fw-semibold",
										children: item.room_number
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.name || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: getBuildingName(item.building_id)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.floor != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faLayerGroup,
										className: "me-1 text-muted"
									}),
									"Floor ",
									item.floor
								] }) : "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.capacity ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUsers,
									className: "me-1 text-muted"
								}), item.capacity] }) : "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-info-subtle text-info rounded-pill",
								children: item.room_type
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex flex-wrap gap-1",
									children: item.resources ? (typeof item.resources === "string" ? item.resources.split(",").map((s) => s.trim()) : Array.isArray(item.resources) ? item.resources : []).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge bg-light text-dark rounded-pill x-small",
										children: r
									}, i)) : "-"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge rounded-pill bg-${item.status === "active" ? "success" : "secondary"}-subtle text-${item.status === "active" ? "success" : "secondary"}`,
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
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content border-0 shadow-lg rounded-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editItem ? "Edit Room" : "Add Room"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowForm(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-body p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
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
												value: formData.room_number,
												onChange: (e) => setFormData({
													...formData,
													room_number: e.target.value
												}),
												placeholder: "e.g. SCI-A-101"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Room Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												value: formData.name,
												onChange: (e) => setFormData({
													...formData,
													name: e.target.value
												}),
												placeholder: "e.g. Physics Lab 1"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Building"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												value: formData.building_id,
												onChange: (e) => setFormData({
													...formData,
													building_id: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Building"
												}), buildings.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: b.id,
													children: b.name
												}, b.id))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Floor"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control rounded-3",
												value: formData.floor,
												onChange: (e) => setFormData({
													...formData,
													floor: e.target.value
												}),
												placeholder: "e.g. 1",
												min: "0",
												max: "100"
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
													capacity: e.target.value
												}),
												placeholder: "e.g. 30",
												min: "0"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Room Type"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "form-select rounded-3",
												value: formData.room_type,
												onChange: (e) => setFormData({
													...formData,
													room_type: e.target.value
												}),
												children: ROOM_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t,
													children: t
												}, t))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
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
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "active",
													children: "Active"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "inactive",
													children: "Inactive"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-12",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "small fw-bold text-muted mb-2",
													children: "Resources"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "d-flex flex-wrap gap-2",
													children: RESOURCE_OPTIONS.map((res) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: `badge rounded-pill px-3 py-2 cursor-pointer ${selectedResources.includes(res) ? "bg-primary text-white" : "bg-light text-dark border"}`,
														onClick: () => toggleResource(res),
														style: {
															cursor: "pointer",
															userSelect: "none"
														},
														children: [
															res === "Projector" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faDesktop,
																className: "me-1"
															}),
															res === "SmartBoard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faChalkboard,
																className: "me-1"
															}),
															res === "AC" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faWind,
																className: "me-1"
															}),
															selectedResources.includes(res) ? " ✓" : " +"
														]
													}, res))
												}),
												formData.resources && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
														className: "text-muted",
														children: ["Selected: ", formData.resources]
													})
												})
											]
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 p-4 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light rounded-3 px-4",
									onClick: () => setShowForm(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "btn btn-primary rounded-3 px-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faDoorOpen,
										className: "me-2"
									}), editItem ? "Update Room" : "Save Room"]
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .x-small { font-size: 11px; }
        .cursor-pointer { cursor: pointer; }
      ` })
		]
	});
};
//#endregion
export { Rooms as default };
