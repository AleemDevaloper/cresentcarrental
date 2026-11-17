import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $c as faUserTie, $l as plugin_legend, $t as faCheckCircle, Cn as faClock, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, G as faArrowUp, Gr as faFileLines, Ia as faMinus, Jc as faUserPlus, M as faArrowDown, Ma as faMessage, Nt as faCalendarAlt, Pl as ArcElement, Yt as faChartLine, _c as faTrash, bl as useApp, bt as faBriefcase, da as faLayerGroup, fo as faPeopleGroup, ga as faList, gr as faEllipsisVertical, kn as faCloudArrowUp, oo as faPen, os as faSearch, p as Doughnut, ru as require_react, sc as faThLarge, sr as faDownload, tl as faUsers, tu as plugin_tooltip, vl as FontAwesomeIcon, yo as faPieChart, zl as Chart } from "./ai-BHgPkVLC.js";
import { g as AppBarChart } from "./dms-CGB1dD8h.js";
import { a as SAMPLE_TEAMS, n as TeamMemberAvatars, t as TeamsPagination } from "./TeamsPagination-BwYWdQRl.js";
import { t as TeamsTable } from "./TeamsTable-O0E4abSV.js";
//#region src/pages/organization/teams/TeamCardEnhanced.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var TeamCardEnhanced = ({ team, onAction, onOpenDrawer }) => {
	const getStatusColor = (status) => {
		switch (status) {
			case "Active": return "bg-success";
			case "Busy": return "bg-warning";
			case "At Risk": return "bg-danger";
			case "On Hold": return "bg-secondary";
			default: return "bg-primary";
		}
	};
	const getCapacityColor = (capacity) => {
		if (capacity > 90) return "bg-danger";
		if (capacity > 75) return "bg-warning";
		return "bg-success";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "col-lg-4 col-md-6 col-12 mb-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "card border-0 shadow-sm h-100 team-card transition hover-lift position-relative",
			style: {
				borderRadius: 16,
				border: "1px solid #F1F5F9",
				cursor: "pointer"
			},
			onClick: () => onOpenDrawer(team),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-start mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "fw-bold mb-1 text-dark",
							style: {
								fontSize: 20,
								letterSpacing: "-0.5px"
							},
							children: team.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge ${getStatusColor(team.status)} text-white x-small px-2 py-1 rounded-pill`,
								children: team.status
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted x-small fw-bold",
								children: team.department
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "dropdown",
							onClick: (e) => e.stopPropagation(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-link text-muted p-0",
								type: "button",
								"data-bs-toggle": "dropdown",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEllipsisVertical })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "dropdown-menu dropdown-menu-end shadow border-0 rounded-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2",
										onClick: () => onAction("view", team),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faEye,
											className: "me-2 text-primary opacity-75"
										}), " View Team"]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2",
										onClick: () => onAction("edit", team),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faPen,
											className: "me-2 text-info opacity-75"
										}), " Edit Team"]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2",
										onClick: () => onAction("assign_members", team),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faUserPlus,
											className: "me-2 text-success opacity-75"
										}), " Assign Members"]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2",
										onClick: () => onAction("assign_projects", team),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faBriefcase,
											className: "me-2 text-warning opacity-75"
										}), " Assign Projects"]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "dropdown-divider" }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item py-2 text-danger",
										onClick: () => onAction("archive", team),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faTrash,
											className: "me-2 opacity-75"
										}), " Archive Team"]
									}) })
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 d-flex align-items-center justify-content-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted x-small fw-bold text-uppercase mb-1",
							children: "Team Lead"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fw-medium small text-dark",
							children: team.manager
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted x-small fw-bold text-uppercase mb-1",
								children: [team.memberCount, " Members"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMemberAvatars, {
								members: team.members,
								totalCount: team.memberCount
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-2 mb-4 border-top border-bottom py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-4 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted",
									style: { fontSize: 10 },
									children: "Projects"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold text-dark",
									children: team.activeProjects
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-4 text-center border-start border-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted",
									style: { fontSize: 10 },
									children: "Open Tasks"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold text-dark",
									children: team.openTasks
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-4 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted",
									style: { fontSize: 10 },
									children: "Attendance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "fw-bold text-dark",
									children: [team.attendance, "%"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex justify-content-between align-items-center mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted x-small fw-bold text-uppercase",
								children: "Productivity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "fw-bold text-dark x-small",
								children: [team.productivityPercent, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "progress",
							style: {
								height: 6,
								borderRadius: 3
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "progress-bar bg-primary transition-width",
								style: { width: `${team.productivityPercent}%` }
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex justify-content-between align-items-center mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted x-small fw-bold text-uppercase",
								children: "Capacity Used"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "fw-bold text-dark x-small",
								children: [team.capacity, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "progress",
							style: {
								height: 6,
								borderRadius: 3
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `progress-bar ${getCapacityColor(team.capacity)} transition-width`,
								style: { width: `${team.capacity}%` }
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted x-small fw-bold text-uppercase mb-2",
							children: "Top Skills"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap gap-1",
							children: [team.skills?.slice(0, 3).map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-light text-muted x-small fw-medium border",
								children: skill
							}, skill)), team.skills?.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "badge bg-light text-muted x-small fw-medium border",
								children: ["+", team.skills.length - 3]
							})]
						})]
					})
				]
			})
		})
	});
};
//#endregion
//#region src/pages/organization/teams/TeamDetailDrawer.jsx
var TeamDetailDrawer = ({ isOpen, onClose, team }) => {
	if (!team) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `offcanvas offcanvas-end ${isOpen ? "show" : ""}`,
		style: {
			visibility: isOpen ? "visible" : "hidden",
			width: "500px",
			borderLeft: "1px solid #f1f5f9",
			boxShadow: "-10px 0 30px rgba(0,0,0,0.05)"
		},
		tabIndex: "-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "offcanvas-header border-bottom py-3 px-4 bg-light",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm",
						style: {
							width: 48,
							height: 48,
							backgroundColor: "#6366f1",
							fontSize: "16px"
						},
						children: team.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
						className: "offcanvas-title fw-bold text-dark mb-0",
						children: team.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "badge bg-primary-subtle text-primary x-small rounded-pill",
						children: team.department
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-close shadow-none",
					onClick: onClose,
					"aria-label": "Close"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "offcanvas-body p-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 border-bottom bg-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted x-small fw-bold text-uppercase mb-1",
										children: "Team Lead"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-medium text-dark",
										children: team.manager
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted x-small fw-bold text-uppercase mb-1",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge bg-success-subtle text-success px-2 py-1 rounded-pill",
										children: team.status
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted x-small fw-bold text-uppercase mb-1",
										children: "Created Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-medium text-dark",
										children: new Date(team.createdAt).toLocaleDateString()
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted x-small fw-bold text-uppercase mb-1",
										children: "Total Members"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fw-medium text-dark",
										children: [team.memberCount, " Members"]
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-bottom",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
								className: "fw-bold mb-3 d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUsers,
									className: "text-primary small"
								}), "Members & Availability"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex flex-column gap-3",
								children: team.members?.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center justify-content-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-circle d-flex align-items-center justify-content-center fw-bold text-white",
											style: {
												width: 32,
												height: 32,
												backgroundColor: member.color,
												fontSize: 10
											},
											children: member.initials
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fw-medium small text-dark",
											children: member.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted",
											style: { fontSize: 10 },
											children: "Software Engineer"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge bg-success border-0 rounded-circle p-1",
										style: {
											width: 8,
											height: 8
										},
										title: "Available"
									})]
								}, member.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-light btn-sm w-100 mt-3 fw-bold text-primary",
								children: "View All Members"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-bottom bg-light-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
							className: "fw-bold mb-3 d-flex align-items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faBriefcase,
								className: "text-info small"
							}), "Assigned Projects"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "list-group list-group-flush rounded-3 border",
							children: [
								1,
								2,
								3
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "list-group-item bg-white py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-bold small text-dark",
										children: "Enterprise Portal Redesign"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge bg-info-subtle text-info x-small",
										children: "75%"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress",
									style: { height: 4 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress-bar bg-info",
										style: { width: "75%" }
									})
								})]
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
							className: "fw-bold mb-3 d-flex align-items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faFileLines,
								className: "text-secondary small"
							}), "Shared Documents"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-column gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded border bg-white d-flex align-items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded bg-danger-subtle text-danger p-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileLines })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-grow-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-medium small",
										children: "Team_Policy_v2.pdf"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted",
										style: { fontSize: 10 },
										children: "2.4 MB • Updated yesterday"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded border bg-white d-flex align-items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded bg-primary-subtle text-primary p-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBriefcase })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-grow-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-medium small",
										children: "Q2_Roadmap.xlsx"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted",
										style: { fontSize: 10 },
										children: "1.8 MB • Updated 3 days ago"
									})]
								})]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "offcanvas-footer border-top p-3 bg-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary flex-grow-1 fw-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faMessage,
							className: "me-2"
						}), " Open Team Chat"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-outline-secondary px-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faClock })
					})]
				})
			})
		]
	}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "offcanvas-backdrop fade show",
		onClick: onClose,
		style: { zIndex: 1040 }
	})] });
};
//#endregion
//#region src/pages/organization/teams/TeamManagement.jsx
Chart.register(ArcElement, plugin_tooltip, plugin_legend);
var TeamManagement = () => {
	const { addNotification } = useApp();
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const [pageSize, setPageSize] = (0, import_react.useState)(6);
	const [selectedTeam, setSelectedTeam] = (0, import_react.useState)(null);
	const [isDrawerOpen, setIsDrawerOpen] = (0, import_react.useState)(false);
	const kpis = [
		{
			label: "Total Teams",
			value: "28",
			icon: faPeopleGroup,
			color: "primary"
		},
		{
			label: "Total Members",
			value: "342",
			icon: faUsers,
			color: "info"
		},
		{
			label: "Active Teams",
			value: "25",
			icon: faCheckCircle,
			color: "success"
		},
		{
			label: "Productivity",
			value: "89%",
			icon: faChartLine,
			color: "warning"
		},
		{
			label: "Active Projects",
			value: "67",
			icon: faLayerGroup,
			color: "danger"
		},
		{
			label: "Hours Worked",
			value: "5,420h",
			icon: faClock,
			color: "dark"
		}
	];
	const filteredTeams = (0, import_react.useMemo)(() => {
		return SAMPLE_TEAMS.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.manager.toLowerCase().includes(searchQuery.toLowerCase()) || t.department.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [searchQuery]);
	const totalPages = Math.ceil(filteredTeams.length / pageSize);
	const paginatedTeams = filteredTeams.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const handleOpenDrawer = (team) => {
		setSelectedTeam(team);
		setIsDrawerOpen(true);
	};
	const handleAction = (action, team) => {
		addNotification(`${action} action for ${team.name}`, "info");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-1 fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "fw-bold text-dark mb-1",
					children: "Teams"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted small mb-0",
					children: "Manage organizational teams, members, workloads, productivity, and performance."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-primary fw-bold px-3",
							style: {
								height: 42,
								borderRadius: 10
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPlus,
								className: "me-2"
							}), " Create Team"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-outline-secondary fw-bold px-3",
							style: {
								height: 42,
								borderRadius: 10
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCloudArrowUp,
								className: "me-2"
							}), " Import"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-outline-secondary fw-bold px-3",
							style: {
								height: 42,
								borderRadius: 10
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faDownload,
								className: "me-2"
							}), " Export"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-light fw-bold px-3 border",
							style: {
								height: 42,
								borderRadius: 10
							},
							children: "Bulk Actions"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: kpis.map((kpi, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-2 col-md-4 col-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: { borderRadius: 15 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `text-${kpi.color} mb-2`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: kpi.icon })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold text-dark fs-5",
									children: kpi.value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted",
									style: { fontSize: 11 },
									children: kpi.label
								})
							]
						})
					})
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm mb-4",
				style: { borderRadius: 15 },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-body py-2 px-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex flex-wrap align-items-center justify-content-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-3 flex-grow-1",
							style: { maxWidth: 400 },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "input-group input-group-sm border rounded-pill px-2 bg-light",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "input-group-text bg-transparent border-0 text-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: "form-control bg-transparent border-0 shadow-none",
									placeholder: "Search teams...",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-light btn-sm rounded-pill border px-3",
								children: "Filters"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex align-items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "btn-group btn-group-sm bg-light p-1 rounded-pill",
								role: "group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: `btn rounded-pill px-3 border-0 ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-muted"}`,
										onClick: () => setViewMode("grid"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faThLarge,
											className: "me-1"
										}), " Grid"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: `btn rounded-pill px-3 border-0 ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-muted"}`,
										onClick: () => setViewMode("list"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faList,
											className: "me-1"
										}), " List"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: `btn rounded-pill px-3 border-0 ${viewMode === "kanban" ? "bg-white shadow-sm text-primary" : "text-muted"}`,
										onClick: () => setViewMode("kanban"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCalendarAlt,
											className: "me-1"
										}), " Kanban"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: `btn rounded-pill px-3 border-0 ${viewMode === "analytics" ? "bg-white shadow-sm text-primary" : "text-muted"}`,
										onClick: () => setViewMode("analytics"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faPieChart,
											className: "me-1"
										}), " Analytics"]
									})
								]
							})
						})]
					})
				})
			}),
			viewMode === "grid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3",
				children: paginatedTeams.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamCardEnhanced, {
					team,
					onAction: handleAction,
					onOpenDrawer: handleOpenDrawer
				}, team.id))
			}),
			viewMode === "list" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamsTable, {
				teams: paginatedTeams,
				onAction: handleAction
			}),
			viewMode === "kanban" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-auto pb-2",
				style: { maxHeight: "calc(100vh - 420px)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex gap-3",
					style: { minWidth: 900 },
					children: [
						"Active",
						"Busy",
						"At Risk",
						"On Hold",
						"Onboarding",
						"Inactive"
					].map((status) => {
						const teamsInStatus = SAMPLE_TEAMS.filter((t) => t.status === status);
						const statusColor = {
							Active: "#10b981",
							Busy: "#f59e0b",
							"At Risk": "#ef4444",
							"On Hold": "#6b7280",
							Onboarding: "#6366f1",
							Inactive: "#94a3b8"
						}[status] || "#94a3b8";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card border-0 shadow-sm flex-shrink-0",
							style: {
								width: 300,
								borderRadius: 16,
								maxHeight: "calc(100vh - 440px)"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "card-header bg-transparent border-0 px-3 pt-3 pb-0 d-flex align-items-center justify-content-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
											width: 10,
											height: 10,
											borderRadius: "50%",
											backgroundColor: statusColor
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold text-dark small",
											children: status
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge bg-light text-muted rounded-pill",
											children: teamsInStatus.length
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body px-3 pt-2 overflow-auto",
								style: { maxHeight: "calc(100vh - 500px)" },
								children: [teamsInStatus.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted small mb-0",
										children: "No teams"
									})
								}), teamsInStatus.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "card border mb-2 transition hover-lift",
									style: {
										borderRadius: 12,
										borderColor: "#f1f5f9",
										cursor: "pointer"
									},
									onClick: () => handleOpenDrawer(team),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "card-body p-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex justify-content-between align-items-start mb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
													className: "fw-bold text-dark mb-0",
													style: { fontSize: 13 },
													children: team.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "badge bg-light text-muted x-small rounded-pill",
													children: team.department
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2 mb-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faUserTie,
														className: "text-muted",
														style: { fontSize: 10 }
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted x-small",
														children: team.manager
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted x-small ms-auto",
														children: [team.memberCount, " members"]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2 mb-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted x-small",
													children: "Productivity"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "fw-bold x-small ms-auto",
													children: [team.productivityPercent, "%"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "progress mb-2",
												style: {
													height: 4,
													borderRadius: 2
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "progress-bar",
													style: {
														width: `${team.productivityPercent}%`,
														backgroundColor: statusColor
													}
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center justify-content-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "x-small text-muted",
													children: [team.completedTasks, " tasks done"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `x-small fw-bold ${team.trend === "up" ? "text-success" : team.trend === "down" ? "text-danger" : "text-muted"}`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: team.trend === "up" ? faArrowUp : team.trend === "down" ? faArrowDown : faMinus,
															style: { fontSize: 10 }
														}),
														" ",
														team.efficiency,
														"%"
													]
												})]
											})
										]
									})
								}, team.id))]
							})]
						}, status);
					})
				})
			}),
			viewMode === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row g-3 mb-4",
					children: [
						{
							label: "Avg Productivity",
							value: `${Math.round(SAMPLE_TEAMS.reduce((s, t) => s + t.productivityPercent, 0) / SAMPLE_TEAMS.length)}%`,
							icon: faChartLine,
							color: "primary"
						},
						{
							label: "High Performing",
							value: SAMPLE_TEAMS.filter((t) => t.productivityPercent >= 80).length.toString(),
							icon: faCheckCircle,
							color: "success"
						},
						{
							label: "Needs Improvement",
							value: SAMPLE_TEAMS.filter((t) => t.productivityPercent < 60).length.toString(),
							icon: faArrowDown,
							color: "danger"
						},
						{
							label: "Total Capacity",
							value: `${Math.round(SAMPLE_TEAMS.reduce((s, t) => s + (t.capacity || 0), 0) / SAMPLE_TEAMS.length)}%`,
							icon: faUsers,
							color: "info"
						}
					].map((kpi, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-3 col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm h-100",
							style: { borderRadius: 15 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `text-${kpi.color} mb-2`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: kpi.icon })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-bold text-dark fs-4",
										children: kpi.value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted",
										style: { fontSize: 11 },
										children: kpi.label
									})
								]
							})
						})
					}, idx))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppBarChart, {
							title: "Productivity by Team",
							labels: SAMPLE_TEAMS.map((t) => t.name),
							datasets: [{
								label: "Productivity %",
								data: SAMPLE_TEAMS.map((t) => t.productivityPercent),
								backgroundColor: SAMPLE_TEAMS.map((t) => t.productivityPercent >= 80 ? "#10b981" : t.productivityPercent >= 60 ? "#f59e0b" : "#ef4444")
							}],
							height: 300,
							options: { scales: {
								y: {
									beginAtZero: true,
									max: 100,
									ticks: { callback: (v) => `${v}%` }
								},
								x: { ticks: { font: { size: 10 } } }
							} }
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm h-100",
							style: { borderRadius: 15 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4 d-flex flex-column",
								style: { minHeight: 420 },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
									className: "fw-bold text-dark mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faPieChart,
										className: "text-primary me-2"
									}), "Status Distribution"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-grow-1 d-flex flex-column justify-content-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "position-relative mx-auto",
										style: {
											width: 220,
											height: 220
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
											data: {
												labels: [
													"Active",
													"Busy",
													"At Risk",
													"On Hold",
													"Onboarding"
												],
												datasets: [{
													data: [
														"Active",
														"Busy",
														"At Risk",
														"On Hold",
														"Onboarding"
													].map((s) => SAMPLE_TEAMS.filter((t) => t.status === s).length),
													backgroundColor: [
														"#10b981",
														"#f59e0b",
														"#ef4444",
														"#6b7280",
														"#6366f1"
													],
													borderWidth: 0,
													hoverOffset: 12
												}]
											},
											options: {
												responsive: true,
												maintainAspectRatio: true,
												cutout: "78%",
												animation: {
													animateRotate: true,
													duration: 1e3
												},
												plugins: {
													legend: { display: false },
													tooltip: {
														backgroundColor: "#fff",
														titleColor: "#1e293b",
														bodyColor: "#64748b",
														borderColor: "#f1f5f9",
														borderWidth: 1,
														padding: 12,
														callbacks: { label: (ctx) => {
															const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
															const pct = total > 0 ? Math.round(ctx.raw / total * 100) : 0;
															return ` ${ctx.label}: ${ctx.raw} team${ctx.raw !== 1 ? "s" : ""} (${pct}%)`;
														} }
													}
												}
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "position-absolute top-50 start-50 translate-middle text-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "fw-bold text-dark",
												style: {
													fontSize: 28,
													lineHeight: 1.1
												},
												children: SAMPLE_TEAMS.length
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-muted",
												style: { fontSize: 11 },
												children: "Total Teams"
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 d-flex flex-column gap-2 px-2",
										children: [
											{
												label: "Active",
												color: "#10b981",
												key: "Active"
											},
											{
												label: "Busy",
												color: "#f59e0b",
												key: "Busy"
											},
											{
												label: "At Risk",
												color: "#ef4444",
												key: "At Risk"
											},
											{
												label: "On Hold",
												color: "#6b7280",
												key: "On Hold"
											},
											{
												label: "Onboarding",
												color: "#6366f1",
												key: "Onboarding"
											}
										].map(({ label, color, key }) => {
											const count = SAMPLE_TEAMS.filter((t) => t.status === key).length;
											const pct = Math.round(count / SAMPLE_TEAMS.length * 100);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
														width: 10,
														height: 10,
														borderRadius: "50%",
														backgroundColor: color,
														flexShrink: 0
													} }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "x-small text-muted",
														style: { minWidth: 56 },
														children: label
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "progress flex-grow-1",
														style: {
															height: 6,
															borderRadius: 3,
															backgroundColor: "#f1f5f9"
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "progress-bar rounded-pill",
															style: {
																width: `${pct}%`,
																backgroundColor: color,
																transition: "width 1s ease"
															}
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "x-small fw-bold text-dark",
														style: {
															minWidth: 32,
															textAlign: "right"
														},
														children: count
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "x-small text-muted",
														style: {
															minWidth: 36,
															textAlign: "right"
														},
														children: [pct, "%"]
													})
												]
											}, key);
										})
									})]
								})]
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppBarChart, {
							title: "Department Breakdown",
							labels: [...new Set(SAMPLE_TEAMS.map((t) => t.department))],
							datasets: [{
								label: "Teams",
								data: [...new Set(SAMPLE_TEAMS.map((t) => t.department))].map((d) => SAMPLE_TEAMS.filter((t) => t.department === d).length),
								backgroundColor: [
									"#6366f1",
									"#10b981",
									"#f59e0b",
									"#0ea5e9",
									"#ef4444",
									"#8b5cf6"
								]
							}],
							height: 250,
							options: { scales: { y: {
								beginAtZero: true,
								ticks: { stepSize: 1 }
							} } }
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppBarChart, {
							title: "Efficiency Overview",
							labels: SAMPLE_TEAMS.map((t) => t.name),
							datasets: [{
								label: "Efficiency %",
								data: SAMPLE_TEAMS.map((t) => t.efficiency),
								backgroundColor: SAMPLE_TEAMS.map((t) => t.efficiency >= 80 ? "#10b981" : t.efficiency >= 50 ? "#f59e0b" : "#ef4444")
							}],
							height: 250,
							options: { scales: {
								y: {
									beginAtZero: true,
									max: 100,
									ticks: { callback: (v) => `${v}%` }
								},
								x: { ticks: { font: { size: 10 } } }
							} }
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card border-0 shadow-sm",
					style: { borderRadius: 15 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-body p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
							className: "fw-bold text-dark mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faUsers,
								className: "text-primary me-2"
							}), "Team Performance Summary"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-hover align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-light",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "border-0 text-uppercase text-muted x-small fw-bold py-3 px-3",
											children: "Team"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "border-0 text-uppercase text-muted x-small fw-bold py-3 px-3",
											children: "Productivity"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "border-0 text-uppercase text-muted x-small fw-bold py-3 px-3",
											children: "Efficiency"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "border-0 text-uppercase text-muted x-small fw-bold py-3 px-3",
											children: "Tasks"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "border-0 text-uppercase text-muted x-small fw-bold py-3 px-3",
											children: "Attendance"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "border-0 text-uppercase text-muted x-small fw-bold py-3 px-3",
											children: "Trend"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: SAMPLE_TEAMS.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "transition",
									style: { cursor: "pointer" },
									onClick: () => handleOpenDrawer(team),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "fw-bold text-dark small",
												children: team.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-muted x-small",
												children: team.department
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `badge ${team.productivityPercent >= 80 ? "bg-success" : team.productivityPercent >= 60 ? "bg-warning" : "bg-danger"} text-white px-2 py-1 rounded-pill`,
												children: [team.productivityPercent, "%"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2",
												style: { minWidth: 100 },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "progress flex-grow-1",
													style: {
														height: 6,
														borderRadius: 3
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `progress-bar ${team.efficiency >= 80 ? "bg-success" : team.efficiency >= 50 ? "bg-warning" : "bg-danger"}`,
														style: { width: `${team.efficiency}%` }
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "x-small fw-bold text-muted",
													children: [team.efficiency, "%"]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "x-small text-muted",
												children: [
													team.completedTasks,
													"/",
													team.openTasks + team.completedTasks
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "fw-bold small",
												children: [team.attendance, "%"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `x-small fw-bold ${team.trend === "up" ? "text-success" : team.trend === "down" ? "text-danger" : "text-muted"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: team.trend === "up" ? faArrowUp : team.trend === "down" ? faArrowDown : faMinus,
													className: "me-1"
												}), team.trend === "up" ? "Rising" : team.trend === "down" ? "Declining" : "Stable"]
											})
										})
									]
								}, team.id)) })]
							})
						})]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamsPagination, {
				currentPage,
				totalPages,
				pageSize,
				onPageChange: setCurrentPage,
				onPageSizeChange: setPageSize,
				totalItems: filteredTeams.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamDetailDrawer, {
				isOpen: isDrawerOpen,
				onClose: () => setIsDrawerOpen(false),
				team: selectedTeam
			})
		]
	});
};
//#endregion
export { TeamManagement as default };
