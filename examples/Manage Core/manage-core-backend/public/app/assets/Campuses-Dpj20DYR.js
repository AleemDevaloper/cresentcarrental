import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Lc as faUser, _c as faTrash, _r as faEnvelope, bl as useApp, fr as faEdit, go as faPhone, ka as faMapMarkerAlt, os as faSearch, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { L as listCampuses, Q as updateCampus, V as listInstitutions, a as createCampus, y as deleteCampus } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Institution/Campuses.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var Campuses = () => {
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [institutions, setInstitutions] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [instFilter, setInstFilter] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("");
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		code: "",
		institution_id: "",
		campus_head: "",
		address: "",
		phone: "",
		email: "",
		status: "active",
		capacity: ""
	});
	const fetchData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (search) params.search = search;
			if (instFilter) params.institution_id = instFilter;
			if (statusFilter) params.status = statusFilter;
			const [campusRes, instRes] = await Promise.all([listCampuses(params), listInstitutions()]);
			setData(Array.isArray(campusRes) ? campusRes : []);
			setInstitutions(Array.isArray(instRes) ? instRes : []);
		} catch (err) {
			setError(err.message || "Failed to load campuses");
			addNotification?.(err.message || "Failed to load campuses", "danger");
		} finally {
			setLoading(false);
		}
	}, [
		search,
		instFilter,
		statusFilter,
		addNotification
	]);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [fetchData]);
	const getInstitutionName = (id) => {
		const inst = institutions.find((i) => i.id === id);
		return inst ? inst.name : "Unknown";
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData({
			name: "",
			code: "",
			institution_id: institutions[0]?.id || "",
			campus_head: "",
			address: "",
			phone: "",
			email: "",
			status: "active",
			capacity: ""
		});
		setShowForm(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		setFormData({
			name: item.name || "",
			code: item.code || "",
			institution_id: item.institution_id || institutions[0]?.id || "",
			campus_head: item.campus_head || "",
			address: item.address || "",
			phone: item.phone || "",
			email: item.email || "",
			status: item.status || "active",
			capacity: item.capacity ?? ""
		});
		setShowForm(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name || !formData.code) {
			addNotification?.("Name and Code are required", "warning");
			return;
		}
		try {
			if (editItem) {
				await updateCampus(editItem.id, formData);
				addNotification?.("Campus updated successfully", "success");
			} else {
				await createCampus(formData);
				addNotification?.("Campus created successfully", "success");
			}
			setShowForm(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving campus", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this campus?")) return;
		try {
			await deleteCampus(id);
			addNotification?.("Campus deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Campuses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage institution campuses"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "Add Campus"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
									placeholder: "Search campuses...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: instFilter,
								onChange: (e) => setInstFilter(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Institutions"
								}), institutions.map((inst) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: inst.id,
									children: inst.name
								}, inst.id))]
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
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-outline-secondary rounded-3 w-100",
								onClick: () => {
									setSearch("");
									setInstFilter("");
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
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Code" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Institution" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Campus Head" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Phone" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Capacity" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "8",
							className: "text-center py-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
						}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "8",
							className: "text-center py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBuilding,
									className: "fs-1 text-muted opacity-50 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									children: "No campuses found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Add a new campus to get started"
								})
							]
						}) }) : data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faBuilding,
										className: "text-info opacity-50"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold small",
										children: item.name
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: item.code }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: getInstitutionName(item.institution_id)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.campus_head ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUser,
									className: "me-1 text-muted"
								}), item.campus_head] }) : "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.phone || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.capacity ?? "-"
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
								children: editItem ? "Edit Campus" : "Add Campus"
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
												children: ["Campus Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
												placeholder: "e.g. Main Campus"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Code ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												required: true,
												value: formData.code,
												onChange: (e) => setFormData({
													...formData,
													code: e.target.value
												}),
												placeholder: "e.g. MC"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Institution"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												value: formData.institution_id,
												onChange: (e) => setFormData({
													...formData,
													institution_id: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Institution"
												}), institutions.map((inst) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: inst.id,
													children: inst.name
												}, inst.id))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Campus Head"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "input-group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "input-group-text rounded-start-3 bg-transparent",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faUser })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-end-3",
													value: formData.campus_head,
													onChange: (e) => setFormData({
														...formData,
														campus_head: e.target.value
													}),
													placeholder: "Dr. John Doe"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "input-group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "input-group-text rounded-start-3 bg-transparent",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEnvelope })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "email",
													className: "form-control rounded-end-3",
													value: formData.email,
													onChange: (e) => setFormData({
														...formData,
														email: e.target.value
													}),
													placeholder: "campus@institution.edu"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Phone"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "input-group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "input-group-text rounded-start-3 bg-transparent",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPhone })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-end-3",
													value: formData.phone,
													onChange: (e) => setFormData({
														...formData,
														phone: e.target.value
													}),
													placeholder: "+1 (555) 000-0000"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
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
												placeholder: "e.g. 5000"
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
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Address"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "input-group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "input-group-text rounded-start-3 bg-transparent",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faMapMarkerAlt })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-end-3",
													value: formData.address,
													onChange: (e) => setFormData({
														...formData,
														address: e.target.value
													}),
													placeholder: "Campus address"
												})]
											})]
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
										icon: faBuilding,
										className: "me-2"
									}), editItem ? "Update Campus" : "Save Campus"]
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .x-small { font-size: 11px; }
      ` })
		]
	});
};
//#endregion
export { Campuses as default };
