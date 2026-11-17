import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Si as faGlobeAmericas, _c as faTrash, _r as faEnvelope, bl as useApp, fr as faEdit, go as faPhone, jc as faUniversity, ka as faMapMarkerAlt, os as faSearch, ru as require_react, vl as FontAwesomeIcon, xi as faGlobe, yn as faCity } from "./ai-BHgPkVLC.js";
import { S as deleteInstitution, V as listInstitutions, l as createInstitution, tt as updateInstitution } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Institution/Institutions.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var INSTITUTION_TYPES = [
	"School",
	"College",
	"University",
	"Institute",
	"Academy",
	"Other"
];
var Institutions = () => {
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("");
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		short_name: "",
		code: "",
		type: "School",
		status: "active",
		founded_date: "",
		website: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		province: "",
		country: ""
	});
	const fetchData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (search) params.search = search;
			if (typeFilter) params.type = typeFilter;
			if (statusFilter) params.status = statusFilter;
			const res = await listInstitutions(params);
			setData(Array.isArray(res) ? res : []);
		} catch (err) {
			setError(err.message || "Failed to load institutions");
			addNotification?.(err.message || "Failed to load institutions", "danger");
		} finally {
			setLoading(false);
		}
	}, [
		search,
		typeFilter,
		statusFilter,
		addNotification
	]);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [fetchData]);
	const openAddForm = () => {
		setEditItem(null);
		setFormData({
			name: "",
			short_name: "",
			code: "",
			type: "School",
			status: "active",
			founded_date: "",
			website: "",
			email: "",
			phone: "",
			address: "",
			city: "",
			province: "",
			country: ""
		});
		setShowForm(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		setFormData({
			name: item.name || "",
			short_name: item.short_name || "",
			code: item.code || "",
			type: item.type || "School",
			status: item.status || "active",
			founded_date: item.founded_date || "",
			website: item.website || "",
			email: item.email || "",
			phone: item.phone || "",
			address: item.address || "",
			city: item.city || "",
			province: item.province || "",
			country: item.country || ""
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
				await updateInstitution(editItem.id, formData);
				addNotification?.("Institution updated successfully", "success");
			} else {
				await createInstitution(formData);
				addNotification?.("Institution created successfully", "success");
			}
			setShowForm(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving institution", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this institution? This action cannot be undone.")) return;
		try {
			await deleteInstitution(id);
			addNotification?.("Institution deleted", "success");
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
					children: "Institutions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage educational institutions"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-3",
					onClick: openAddForm,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "Add Institution"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "position-relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "position-absolute top-50 translate-middle-y ms-3 text-muted",
									style: { zIndex: 5 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 ps-5 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
									placeholder: "Search by name or code...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: typeFilter,
								onChange: (e) => setTypeFilter(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Types"
								}), INSTITUTION_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
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
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Code" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Founded" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "6",
							className: "text-center py-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
						}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "6",
							className: "text-center py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUniversity,
									className: "fs-1 text-muted opacity-50 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									children: "No institutions found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Add a new institution to get started"
								})
							]
						}) }) : data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUniversity,
										className: "text-primary opacity-50"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-semibold small",
										children: item.name
									}), item.short_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "x-small text-muted",
										children: item.short_name
									})] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: item.code }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-primary-subtle text-primary rounded-pill",
								children: item.type
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge rounded-pill bg-${item.status === "active" ? "success" : "secondary"}-subtle text-${item.status === "active" ? "success" : "secondary"}`,
								children: item.status
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.founded_date || "-"
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
								children: editItem ? "Edit Institution" : "Add Institution"
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
												children: ["Institution Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
												placeholder: "e.g. Springfield University"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Short Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												value: formData.short_name,
												onChange: (e) => setFormData({
													...formData,
													short_name: e.target.value
												}),
												placeholder: "e.g. SU"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
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
												placeholder: "e.g. SPR-U"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Type"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "form-select rounded-3",
												value: formData.type,
												onChange: (e) => setFormData({
													...formData,
													type: e.target.value
												}),
												children: INSTITUTION_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t,
													children: t
												}, t))
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
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Founded Date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												className: "form-control rounded-3",
												value: formData.founded_date,
												onChange: (e) => setFormData({
													...formData,
													founded_date: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Website"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "input-group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "input-group-text rounded-start-3 bg-transparent",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faGlobe })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "url",
													className: "form-control rounded-end-3",
													value: formData.website,
													onChange: (e) => setFormData({
														...formData,
														website: e.target.value
													}),
													placeholder: "https://"
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
													placeholder: "info@institution.edu"
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
													placeholder: "123 Main Street"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "City"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "input-group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "input-group-text rounded-start-3 bg-transparent",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCity })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-end-3",
													value: formData.city,
													onChange: (e) => setFormData({
														...formData,
														city: e.target.value
													}),
													placeholder: "City"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Province/State"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												value: formData.province,
												onChange: (e) => setFormData({
													...formData,
													province: e.target.value
												}),
												placeholder: "Province"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Country"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "input-group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "input-group-text rounded-start-3 bg-transparent",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faGlobeAmericas })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control rounded-end-3",
													value: formData.country,
													onChange: (e) => setFormData({
														...formData,
														country: e.target.value
													}),
													placeholder: "Country"
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
									}), editItem ? "Update Institution" : "Save Institution"]
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
export { Institutions as default };
