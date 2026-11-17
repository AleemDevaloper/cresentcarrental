import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Ar as faFileAlt, Br as faFileExport, Cn as faClock, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, G as faArrowUp, Hr as faFileImport, Hs as faStickyNote, I as faArrowRight, Lr as faFileContract, M as faArrowDown, Nt as faCalendarAlt, P as faArrowLeft, Rc as faUserCheck, Ur as faFileInvoice, Xt as faChartPie, _c as faTrash, _r as faEnvelope, d as useTranslation, da as faLayerGroup, el as faUserXmark, fa as faLifeRing, fr as faEdit, ga as faList, go as faPhone, gr as faEllipsisVertical, j as faArchive, jo as faProjectDiagram, nn as faChevronDown, os as faSearch, ru as require_react, sc as faThLarge, ti as faFilter, tl as faUsers, vl as FontAwesomeIcon, xi as faGlobe } from "./ai-BHgPkVLC.js";
//#region src/pages/workforce/clients/ClientKPIOverview.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var KPICard = ({ title, value, trend, trendValue, icon, color, progress }) => {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "col-xl-3 col-md-6 mb-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `position-absolute top-0 start-0 w-100 h-1 bg-${color}`,
				style: { opacity: .1 }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between align-items-center mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `bg-${color} bg-opacity-10 p-3 rounded-4`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon,
							className: `text-${color} fs-4`
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `badge ${trend === "up" ? "bg-success" : "bg-danger"} bg-opacity-10 text-${trend === "up" ? "success" : "danger"} rounded-pill px-2 py-1`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: trend === "up" ? faArrowUp : faArrowDown,
									className: "me-1 small"
								}),
								trendValue,
								"%"
							]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
						className: "text-muted fw-semibold small mb-1",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "fw-bold mb-2",
						children: value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "progress rounded-pill",
						style: { height: "6px" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `progress-bar bg-${color} rounded-pill`,
							role: "progressbar",
							style: { width: `${progress}%` },
							"aria-valuenow": progress,
							"aria-valuemin": "0",
							"aria-valuemax": "100"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted small mt-2 mb-0",
						children: [
							trend === "up" ? "↑" : "↓",
							" ",
							trendValue,
							"% ",
							t("from_last_month")
						]
					})
				] })]
			})]
		})
	});
};
var ClientKPIOverview = () => {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "row g-4 mb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
				title: t("total_clients"),
				value: "3,500",
				trend: "up",
				trendValue: "22.5",
				icon: faUsers,
				color: "primary",
				progress: 75
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
				title: t("active_clients"),
				value: "2,900",
				trend: "up",
				trendValue: "15.2",
				icon: faUserCheck,
				color: "success",
				progress: 82
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
				title: t("inactive_clients"),
				value: "450",
				trend: "down",
				trendValue: "3.8",
				icon: faUserXmark,
				color: "warning",
				progress: 15
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
				title: t("archived_clients"),
				value: "150",
				trend: "down",
				trendValue: "10.5",
				icon: faArchive,
				color: "secondary",
				progress: 5
			})
		]
	});
};
//#endregion
//#region src/pages/workforce/clients/ClientSearchControls.jsx
var ClientSearchControls = ({ viewMode, setViewMode, searchQuery, setSearchQuery, filters, setFilters }) => {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "card border-0 shadow-sm rounded-4 mb-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "card-body p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3 align-items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "input-group bg-light rounded-pill px-3 py-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "input-group-text bg-transparent border-0 text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								className: "form-control bg-transparent border-0 shadow-none",
								placeholder: t("search_clients"),
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value)
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "dropdown",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-light rounded-pill px-3 d-flex align-items-center gap-2 border shadow-sm bg-white",
										type: "button",
										"data-bs-toggle": "dropdown",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFilter,
												className: "text-muted small"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												t("status"),
												": ",
												filters.status
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faChevronDown,
												className: "text-muted extra-small"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "dropdown-menu border-0 shadow rounded-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "dropdown-item",
												onClick: () => setFilters({
													...filters,
													status: "All"
												}),
												children: "All"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "dropdown-item",
												onClick: () => setFilters({
													...filters,
													status: "Active"
												}),
												children: "Active"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "dropdown-item",
												onClick: () => setFilters({
													...filters,
													status: "Inactive"
												}),
												children: "Inactive"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "dropdown-item",
												onClick: () => setFilters({
													...filters,
													status: "Archived"
												}),
												children: "Archived"
											}) })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "dropdown",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-light rounded-pill px-3 d-flex align-items-center gap-2 border shadow-sm bg-white",
										type: "button",
										"data-bs-toggle": "dropdown",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFilter,
												className: "text-muted small"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												t("industry"),
												": ",
												filters.industry
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faChevronDown,
												className: "text-muted extra-small"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "dropdown-menu border-0 shadow rounded-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "dropdown-item",
												onClick: () => setFilters({
													...filters,
													industry: "All"
												}),
												children: "All"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "dropdown-item",
												onClick: () => setFilters({
													...filters,
													industry: "Technology"
												}),
												children: "Technology"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "dropdown-item",
												onClick: () => setFilters({
													...filters,
													industry: "Logistics"
												}),
												children: "Logistics"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "dropdown-item",
												onClick: () => setFilters({
													...filters,
													industry: "Finance"
												}),
												children: "Finance"
											}) })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "dropdown",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-light rounded-pill px-3 d-flex align-items-center gap-2 border shadow-sm bg-white",
										type: "button",
										"data-bs-toggle": "dropdown",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFilter,
												className: "text-muted small"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												t("country"),
												": ",
												filters.country
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faChevronDown,
												className: "text-muted extra-small"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "dropdown-menu border-0 shadow rounded-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "dropdown-item",
												onClick: () => setFilters({
													...filters,
													country: "All"
												}),
												children: "All"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "dropdown-item",
												onClick: () => setFilters({
													...filters,
													country: "USA"
												}),
												children: "USA"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "dropdown-item",
												onClick: () => setFilters({
													...filters,
													country: "United Kingdom"
												}),
												children: "United Kingdom"
											}) })
										]
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-2 text-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "btn-group bg-light p-1 rounded-pill",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: `btn rounded-pill px-3 border-0 ${viewMode === "grid" ? "btn-white shadow-sm fw-bold" : "btn-transparent text-muted"}`,
								onClick: () => setViewMode("grid"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faThLarge })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: `btn rounded-pill px-3 border-0 ${viewMode === "table" ? "btn-white shadow-sm fw-bold" : "btn-transparent text-muted"}`,
								onClick: () => setViewMode("table"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faList })
							})]
						})
					})
				]
			})
		})
	});
};
//#endregion
//#region src/pages/workforce/clients/ClientCard.jsx
var ClientCard = ({ client, onViewDetails }) => {
	const { t } = useTranslation();
	const getHealthColor = (score) => {
		if (score >= 90) return "success";
		if (score >= 75) return "primary";
		if (score >= 50) return "warning";
		return "danger";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "col-xl-3 col-lg-4 col-md-6 mb-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "card border-0 shadow-sm rounded-4 h-100 transition-hover",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-start mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "position-relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-light rounded-circle d-flex align-items-center justify-content-center",
								style: {
									width: "64px",
									height: "64px"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "fw-bold text-primary fs-4",
									children: client.name.charAt(0)
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "position-absolute bottom-0 end-0 translate-middle-x p-1 bg-success border border-2 border-white rounded-circle" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "dropdown",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-link text-muted p-0 shadow-none",
								type: "button",
								"data-bs-toggle": "dropdown",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEllipsisVertical })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "dropdown-menu dropdown-menu-end border-0 shadow rounded-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faEdit,
												className: "me-2 small"
											}),
											" ",
											t("edit_client")
										]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faProjectDiagram,
												className: "me-2 small"
											}),
											" ",
											t("assign_project")
										]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFileInvoice,
												className: "me-2 small"
											}),
											" ",
											t("create_invoice")
										]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faCalendarAlt,
												className: "me-2 small"
											}),
											" ",
											t("schedule_meeting")
										]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFileContract,
												className: "me-2 small"
											}),
											" ",
											t("view_contracts")
										]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "dropdown-divider" }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2 text-warning",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faArchive,
												className: "me-2 small"
											}),
											" ",
											t("archive_client")
										]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2 text-danger",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faTrash,
												className: "me-2 small"
											}),
											" ",
											t("delete_client")
										]
									}) })
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "fw-bold mb-1 text-truncate",
							children: client.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted small mb-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faGlobe,
									className: "me-1"
								}),
								" ",
								client.country
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-light rounded-4 p-3 mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex align-items-center gap-2 mb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary fw-bold small text-truncate",
									children: client.company_name
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2 mb-2 small text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faEnvelope,
									className: "extra-small"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-truncate",
									children: client.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2 small text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPhone,
									className: "extra-small"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: client.phone })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex justify-content-between align-items-center mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted small fw-semibold",
								children: t("projects")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "fw-bold small",
								children: [
									client.projects_completed,
									" / ",
									client.projects_total
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "progress rounded-pill",
							style: { height: "8px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `progress-bar bg-${getHealthColor(client.health_score)} rounded-pill`,
								role: "progressbar",
								style: { width: `${client.projects_completed / client.projects_total * 100}%` }
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-outline-primary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 border-2 transition-all hover-bg-primary hover-text-white",
						onClick: () => onViewDetails(client),
						children: [t("view_details"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faArrowRight,
							className: "small"
						})]
					})
				]
			})
		})
	});
};
//#endregion
//#region src/pages/workforce/clients/ClientGridView.jsx
var ClientGridView = ({ clients, onViewDetails }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "row g-4",
		children: [clients.map((client) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientCard, {
			client,
			onViewDetails
		}, client.id)), clients.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-12 text-center py-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "No clients found matching your criteria."
			})
		})]
	});
};
//#endregion
//#region src/pages/workforce/clients/ClientTableView.jsx
var ClientTableView = ({ clients, onViewDetails }) => {
	const { t } = useTranslation();
	const getStatusBadge = (status) => {
		switch (status) {
			case "Active": return "bg-success";
			case "Inactive": return "bg-warning";
			case "Archived": return "bg-secondary";
			default: return "bg-primary";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card border-0 shadow-sm rounded-4 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "table-responsive",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "table table-hover align-middle mb-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-light",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 border-0 small text-uppercase text-muted fw-bold",
							children: t("client")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-3 border-0 small text-uppercase text-muted fw-bold",
							children: t("company")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-3 border-0 small text-uppercase text-muted fw-bold",
							children: t("status")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-3 border-0 small text-uppercase text-muted fw-bold",
							children: t("industry")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-3 border-0 small text-uppercase text-muted fw-bold",
							children: t("projects")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-3 border-0 small text-uppercase text-muted fw-bold text-end px-4",
							children: t("actions")
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: clients.map((client) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-bottom-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 border-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-light rounded-circle d-flex align-items-center justify-content-center",
									style: {
										width: "40px",
										height: "40px"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-primary small",
										children: client.name.charAt(0)
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold",
									children: client.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted small",
									children: client.email
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "py-3 border-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-semibold",
								children: client.company_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted small",
								children: client.country
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 border-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge ${getStatusBadge(client.status)} bg-opacity-10 text-${client.status === "Active" ? "success" : client.status === "Inactive" ? "warning" : "secondary"} rounded-pill px-3`,
								children: client.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 border-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted small",
								children: client.industry
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 border-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress rounded-pill flex-grow-1",
									style: {
										height: "6px",
										width: "60px"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress-bar bg-primary",
										style: { width: `${client.projects_completed / client.projects_total * 100}%` }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "small text-muted",
									children: [
										client.projects_completed,
										"/",
										client.projects_total
									]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 border-0 text-end px-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex justify-content-end gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-light btn-sm rounded-circle p-2",
										onClick: () => onViewDetails(client),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faEye,
											className: "text-muted"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-light btn-sm rounded-circle p-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faEdit,
											className: "text-muted"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "dropdown",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-light btn-sm rounded-circle p-2",
											type: "button",
											"data-bs-toggle": "dropdown",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faEllipsisVertical,
												className: "text-muted"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "dropdown-menu dropdown-menu-end border-0 shadow rounded-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "dropdown-item py-2 text-danger",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faTrash,
														className: "me-2 small"
													}),
													" ",
													t("delete")
												]
											}) })
										})]
									})
								]
							})
						})
					]
				}, client.id)) })]
			})
		}), clients.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center py-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "No clients found matching your criteria."
			})
		})]
	});
};
//#endregion
//#region src/pages/workforce/clients/ClientDetailView.jsx
var ClientDetailView = ({ client, onBack }) => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const tabs = [
		{
			id: "overview",
			label: t("overview"),
			icon: faChartPie
		},
		{
			id: "projects",
			label: t("projects"),
			icon: faProjectDiagram
		},
		{
			id: "invoices",
			label: t("invoices"),
			icon: faFileInvoice
		},
		{
			id: "documents",
			label: t("documents"),
			icon: faFileAlt
		},
		{
			id: "meetings",
			label: t("meetings"),
			icon: faCalendarAlt
		},
		{
			id: "contracts",
			label: t("contracts"),
			icon: faFileContract
		},
		{
			id: "contacts",
			label: t("contacts"),
			icon: faUsers
		},
		{
			id: "timeline",
			label: t("timeline"),
			icon: faClock
		},
		{
			id: "notes",
			label: t("notes"),
			icon: faStickyNote
		},
		{
			id: "support",
			label: t("support"),
			icon: faLifeRing
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "client-detail-view p-4",
		style: {
			backgroundColor: "#F8FAFC",
			minHeight: "100vh"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn btn-link text-decoration-none text-muted p-0 mb-3",
				onClick: onBack,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faArrowLeft,
					className: "me-2"
				}), t("back_to_clients")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center",
						style: {
							width: "80px",
							height: "80px"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "fw-bold text-primary display-6",
							children: client.name.charAt(0)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "fw-bold mb-1",
						children: client.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex gap-3 text-muted small",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBuilding,
									className: "me-1"
								}),
								" ",
								client.company_name
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faGlobe,
									className: "me-1"
								}),
								" ",
								client.country
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faCalendarAlt,
									className: "me-1"
								}),
								" ",
								t("client_since"),
								": ",
								client.since
							] })
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-outline-secondary rounded-pill px-4 bg-white border-0 shadow-sm",
						children: t("edit")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-primary rounded-pill px-4 shadow-sm",
						children: t("contact_client")
					})]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-lg-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card border-0 shadow-sm rounded-4 p-4 mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
							className: "fw-bold mb-3",
							children: t("contact_details")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-muted small d-block mb-1",
								children: t("email")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faEnvelope,
									className: "text-muted extra-small"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "small fw-semibold",
									children: client.email
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-muted small d-block mb-1",
								children: t("phone")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPhone,
									className: "text-muted extra-small"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "small fw-semibold",
									children: client.phone
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
							className: "fw-bold mb-3",
							children: t("client_segmentation")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-primary bg-opacity-10 text-primary rounded-pill px-3",
								children: client.type
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-info bg-opacity-10 text-info rounded-pill px-3",
								children: client.industry
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
							className: "fw-bold mb-3",
							children: t("health_score")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `display-6 fw-bold text-${client.health_score >= 80 ? "success" : "warning"}`,
								children: client.health_score
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold small",
								children: t("excellent")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted extra-small",
								children: "Based on 12 metrics"
							})] })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card border-0 shadow-sm rounded-4 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
						className: "fw-bold mb-3",
						children: t("account_manager")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-light rounded-circle",
							style: {
								width: "40px",
								height: "40px"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fw-bold small",
							children: "Alex Johnson"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted extra-small",
							children: "Senior Account Executive"
						})] })]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-lg-9",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card border-0 shadow-sm rounded-4 h-100 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-header bg-white border-0 p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "nav nav-tabs border-0 px-4 pt-3 flex-nowrap overflow-auto hide-scrollbar",
							children: tabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `nav-link border-0 pb-3 px-3 small fw-bold transition-all position-relative ${activeTab === tab.id ? "text-primary active-tab-indicator" : "text-muted"}`,
								onClick: () => setActiveTab(tab.id),
								style: { whiteSpace: "nowrap" },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: tab.icon,
										className: "me-2"
									}),
									tab.label,
									activeTab === tab.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "position-absolute bottom-0 start-0 w-100 bg-primary",
										style: { height: "3px" }
									})
								]
							}, tab.id))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-body p-4",
						children: [activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-4 bg-light text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											className: "text-muted small mb-2",
											children: t("revenue_generated")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "fw-bold mb-0",
											children: "$45,200.00"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-4 bg-light text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											className: "text-muted small mb-2",
											children: t("pending_invoices")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "fw-bold mb-0 text-warning",
											children: "03"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-4 bg-light text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											className: "text-muted small mb-2",
											children: t("active_contracts")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "fw-bold mb-0 text-success",
											children: "02"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-12 mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "fw-bold mb-4",
										children: t("client_activity")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "activity-timeline position-relative ps-4 border-start py-2 ms-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "activity-item mb-4 position-relative",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "position-absolute start-0 translate-middle-x bg-primary rounded-circle border border-4 border-white shadow-sm",
														style: {
															width: "16px",
															height: "16px",
															left: "-16px"
														}
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "small text-muted mb-1",
														children: "2 hours ago"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "fw-bold small",
														children: "Meeting Scheduled"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted extra-small",
														children: "Quarterly Business Review with Brain Thompson"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "activity-item mb-4 position-relative",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "position-absolute start-0 translate-middle-x bg-success rounded-circle border border-4 border-white shadow-sm",
														style: {
															width: "16px",
															height: "16px",
															left: "-16px"
														}
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "small text-muted mb-1",
														children: "Yesterday"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "fw-bold small",
														children: "Invoice Paid"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted extra-small",
														children: "Invoice #INV-2024-001 has been settled"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "activity-item position-relative",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "position-absolute start-0 translate-middle-x bg-info rounded-circle border border-4 border-white shadow-sm",
														style: {
															width: "16px",
															height: "16px",
															left: "-16px"
														}
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "small text-muted mb-1",
														children: "3 days ago"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "fw-bold small",
														children: "Contract Signed"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted extra-small",
														children: "Service Level Agreement renewed for 2024"
													})
												]
											})
										]
									})]
								})
							]
						}), activeTab !== "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faStickyNote,
									className: "display-4 text-light mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "text-muted",
									children: t("content_coming_soon")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted small",
									children: [
										"We are working on bringing ",
										activeTab,
										" data to this view."
									]
								})
							]
						})]
					})]
				})
			})]
		})]
	});
};
//#endregion
//#region src/pages/workforce/clients/ClientsPage.jsx
var ClientsPage = () => {
	const { t } = useTranslation();
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [selectedClient, setSelectedClient] = (0, import_react.useState)(null);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		status: "All",
		industry: "All",
		country: "All"
	});
	const [clients, setClients] = (0, import_react.useState)([{
		id: 1,
		name: "Brian Thompson",
		company_name: "Collins Group",
		email: "brian@example.com",
		phone: "+1 578 209 4965",
		country: "United Kingdom",
		status: "Active",
		projects_completed: 2,
		projects_total: 12,
		health_score: 85,
		type: "Enterprise",
		industry: "Technology",
		since: "2024-01-15"
	}, {
		id: 2,
		name: "Sarah Jenkins",
		company_name: "Sarah Logistics",
		email: "sarah@logistics.com",
		phone: "+1 423 555 0199",
		country: "USA",
		status: "Active",
		projects_completed: 8,
		projects_total: 10,
		health_score: 95,
		type: "VIP",
		industry: "Logistics",
		since: "2023-11-20"
	}]);
	const handleViewDetails = (client) => {
		setSelectedClient(client);
	};
	const handleBack = () => {
		setSelectedClient(null);
	};
	if (selectedClient) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientDetailView, {
		client: selectedClient,
		onBack: handleBack
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "clients-page-container p-4",
		style: { minHeight: "100vh" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "fw-bold mb-0",
					children: t("clients")
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-2 border-0 shadow-sm bg-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faLayerGroup }), t("bulk_actions")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-2 border-0 shadow-sm bg-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileExport }), t("export_clients")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-2 border-0 shadow-sm bg-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileImport }), t("import_clients")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), t("add_new_client")]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientKPIOverview, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientSearchControls, {
				viewMode,
				setViewMode,
				searchQuery,
				setSearchQuery,
				filters,
				setFilters
			}),
			viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientGridView, {
				clients,
				onViewDetails: handleViewDetails
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientTableView, {
				clients,
				onViewDetails: handleViewDetails
			})
		]
	});
};
//#endregion
export { ClientsPage as default };
