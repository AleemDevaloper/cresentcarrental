import "./rolldown-runtime-Bq5D3eIA.js";
import { Br as faFileExport, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, G as faArrowUp, Ia as faMinus, Jc as faUserPlus, M as faArrowDown, _c as faTrash, ga as faList, gr as faEllipsisVertical, oo as faPen, os as faSearch, ru as require_react, sc as faThLarge, ti as faFilter, tl as faUsers, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { c as calcProgress, l as parseTimeToMinutes, n as TeamMemberAvatars, o as SORT_OPTIONS } from "./TeamsPagination-BwYWdQRl.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var TeamsToolbar = ({ searchQuery, onSearchChange, viewMode, onViewModeChange, sortBy, onSortChange, onAddNew, onToggleFilters, showFilters, activeFilterCount }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "card border-0 shadow-sm mb-4",
	style: { borderRadius: 15 },
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "card-body",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex flex-wrap align-items-center justify-content-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "input-group",
				style: {
					maxWidth: 300,
					minWidth: 240
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "input-group-text bg-transparent border-end-0 text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "search",
					className: "form-control border-start-0",
					placeholder: "Search Teams",
					value: searchQuery,
					onChange: (e) => onSearchChange(e.target.value)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center gap-2 flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "btn-group shadow-sm",
						role: "group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `btn btn-sm ${viewMode === "table" ? "btn-primary" : "btn-light"}`,
							onClick: () => onViewModeChange("table"),
							title: "Table View",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faList })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-light"}`,
							onClick: () => onViewModeChange("grid"),
							title: "Grid View",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faThLarge })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "form-select form-select-sm shadow-sm",
						style: {
							width: "auto",
							minWidth: 180
						},
						value: sortBy,
						onChange: (e) => onSortChange(e.target.value),
						children: SORT_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: opt.id,
							children: ["Sort By : ", opt.label]
						}, opt.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `btn btn-sm ${showFilters ? "btn-primary" : "btn-light"} shadow-sm`,
						onClick: onToggleFilters,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faFilter,
								className: "me-1"
							}),
							"Filters",
							activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-white text-primary ms-1",
								children: activeFilterCount
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn btn-primary fw-bold shadow-sm px-4",
						style: { height: 42 },
						onClick: onAddNew,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPlus,
							className: "me-2"
						}), "Add New"]
					})
				]
			})]
		})
	})
});
//#endregion
//#region src/pages/organization/teams/ProductivityMetrics.jsx
var MetricBar = ({ label, value, color, percent }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "col-4",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-muted mb-1",
			style: { fontSize: 13 },
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fw-bold mb-2 text-dark",
			style: { fontSize: 18 },
			children: value
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "progress rounded-pill shadow-sm",
			style: {
				height: 4,
				backgroundColor: "rgba(0,0,0,0.05)"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "progress-bar rounded-pill transition-width",
				style: {
					width: `${percent}%`,
					backgroundColor: color
				}
			})
		})
	]
});
var ProductivityMetrics = ({ team }) => {
	const totalMins = parseTimeToMinutes(String(team.totalWorked || "0").includes(":") ? team.totalWorked : `${team.totalWorked}:00`);
	const productiveMins = parseTimeToMinutes(team.productive || "0:00");
	const manualMins = parseTimeToMinutes(team.manual || "0:00");
	const unproductiveMins = parseTimeToMinutes(team.unproductive || "0:00");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3 text-center py-2 px-3 mb-4",
		style: {
			backgroundColor: "#F8FAFC",
			borderRadius: 10,
			padding: 12
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted small fw-medium",
			children: "Total Worked (h) : "
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "fw-bold text-dark",
			style: { fontSize: 18 },
			children: team.totalWorked
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "row g-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricBar, {
				label: "Productive (h)",
				value: team.productive,
				color: "#4F46E5",
				percent: calcProgress(productiveMins, totalMins)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricBar, {
				label: "Manual (h)",
				value: team.manual,
				color: "#F59E0B",
				percent: calcProgress(manualMins, totalMins)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricBar, {
				label: "Unproductive",
				value: team.unproductive,
				color: "#EF4444",
				percent: calcProgress(unproductiveMins, totalMins)
			})
		]
	})] });
};
//#endregion
//#region src/pages/organization/teams/TeamCard.jsx
var trendIcon = (trend) => {
	if (trend === "up") return faArrowUp;
	if (trend === "down") return faArrowDown;
	return faMinus;
};
var trendClass = (trend) => {
	if (trend === "up") return "text-success";
	if (trend === "down") return "text-danger";
	return "text-muted";
};
var TeamCard = ({ team, viewMode, onAction }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: viewMode === "grid" ? "col-lg-4 col-md-6 col-12" : "col-12",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "card border-0 shadow-sm h-100 team-card transition hover-lift",
		style: {
			borderRadius: 16,
			border: "1px solid #F1F5F9"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-body p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between align-items-start mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
						className: "fw-bold mb-1 text-dark",
						style: {
							fontSize: 22,
							letterSpacing: "-0.5px"
						},
						children: team.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-2 flex-wrap mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "badge bg-primary-subtle text-primary x-small fw-bold px-2 py-1 rounded-pill",
							children: team.department
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `badge bg-light text-muted x-small fw-bold rounded-pill px-2 py-1 ${trendClass(team.trend)}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: trendIcon(team.trend),
									className: "me-1"
								}),
								team.productivityPercent,
								"% productive"
							]
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "dropdown",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center",
							type: "button",
							"data-bs-toggle": "dropdown",
							"aria-expanded": "false",
							style: {
								width: 34,
								height: 34,
								backgroundColor: "#F8FAFC"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faEllipsisVertical,
								className: "text-muted"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dropdown-item py-2 small",
									onClick: () => onAction("view", team),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faEye,
										className: "me-2 text-primary opacity-75"
									}), " View Details"]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dropdown-item py-2 small",
									onClick: () => onAction("edit", team),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faPen,
										className: "me-2 text-info opacity-75"
									}), " Edit Team"]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dropdown-item py-2 small",
									onClick: () => onAction("assign", team),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUserPlus,
										className: "me-2 text-success opacity-75"
									}), " Assign Members"]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dropdown-item py-2 small",
									onClick: () => onAction("export", team),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faFileExport,
										className: "me-2 text-secondary opacity-75"
									}), " Export Data"]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "dropdown-divider" }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dropdown-item py-2 small text-danger",
									onClick: () => onAction("delete", team),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faTrash,
										className: "me-2 opacity-75"
									}), " Delete Team"]
								}) })
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted small fw-bold text-uppercase mb-2",
						style: {
							letterSpacing: "0.5px",
							fontSize: 11
						},
						children: "Members :"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMemberAvatars, {
						members: team.members,
						totalCount: team.memberCount
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between align-items-center mb-4 px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex flex-column",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted x-small fw-bold text-uppercase",
							children: "Efficiency Score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
							className: "text-dark fs-5",
							children: [team.efficiency, "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold",
						style: { fontSize: 11 },
						children: team.status
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductivityMetrics, { team })
			]
		})
	})
});
//#endregion
//#region src/pages/organization/teams/TeamGrid.jsx
var TeamGrid = ({ teams, viewMode, onAction, loading }) => {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "row g-4",
		children: [
			1,
			2,
			3,
			4,
			5,
			6
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-lg-4 col-md-6 col-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm placeholder-glow",
				style: {
					borderRadius: 16,
					height: 320
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "placeholder col-6 mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "placeholder col-8 mb-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "placeholder col-12 mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "placeholder col-10" })
					]
				})
			})
		}, i))
	});
	if (teams.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center py-5 text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: faUsers,
				className: "fs-1 mb-3 opacity-25 d-block mx-auto"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
				className: "fw-bold text-dark",
				children: "No teams found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "small mb-0",
				children: "Try adjusting your search or filters."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `row ${viewMode === "grid" ? "g-4" : "g-3"}`,
		children: teams.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamCard, {
			team,
			viewMode,
			onAction
		}, team.id))
	});
};
//#endregion
export { TeamsToolbar as n, TeamGrid as t };
