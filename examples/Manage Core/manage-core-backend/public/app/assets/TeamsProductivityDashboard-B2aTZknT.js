import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, Yt as faChartLine, bl as useApp, fo as faPeopleGroup, lt as faBolt, pa as faLightbulb, ru as require_react, tl as faUsers, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { a as SAMPLE_TEAMS, t as TeamsPagination } from "./TeamsPagination-BwYWdQRl.js";
import { n as TeamsToolbar, t as TeamGrid } from "./TeamGrid-XDmhIyOm.js";
//#region src/pages/organization/teams/TeamsProductivityDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var TeamsProductivityDashboard = () => {
	const { addNotification } = useApp();
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [sortBy, setSortBy] = (0, import_react.useState)("highest_productivity");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const [pageSize, setPageSize] = (0, import_react.useState)(6);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [showFilters, setShowFilters] = (0, import_react.useState)(false);
	const [departmentFilter, setDepartmentFilter] = (0, import_react.useState)("All Departments");
	const [managerFilter, setManagerFilter] = (0, import_react.useState)("All Managers");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("All Status");
	const [dateFrom, setDateFrom] = (0, import_react.useState)("");
	const [dateTo, setDateTo] = (0, import_react.useState)("");
	const activeFilterCount = [
		departmentFilter !== "All Departments",
		managerFilter !== "All Managers",
		statusFilter !== "All Status",
		dateFrom,
		dateTo
	].filter(Boolean).length;
	const filteredTeams = (0, import_react.useMemo)(() => {
		let result = SAMPLE_TEAMS.filter((team) => {
			const matchesSearch = !searchQuery || team.name.toLowerCase().includes(searchQuery.toLowerCase()) || team.department.toLowerCase().includes(searchQuery.toLowerCase()) || team.manager.toLowerCase().includes(searchQuery.toLowerCase()) || team.members && team.members.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
			const matchesDept = departmentFilter === "All Departments" || team.department === departmentFilter;
			const matchesManager = managerFilter === "All Managers" || team.manager === managerFilter;
			const matchesStatus = statusFilter === "All Status" || team.status === statusFilter;
			const created = new Date(team.createdAt);
			const matchesFrom = !dateFrom || created >= new Date(dateFrom);
			const matchesTo = !dateTo || created <= /* @__PURE__ */ new Date(`${dateTo}T23:59:59`);
			return matchesSearch && matchesDept && matchesManager && matchesStatus && matchesFrom && matchesTo;
		});
		result = [...result].sort((a, b) => {
			switch (sortBy) {
				case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
				case "highest_productivity": return b.productivityPercent - a.productivityPercent;
				case "lowest_productivity": return a.productivityPercent - b.productivityPercent;
				case "most_members": return b.memberCount - a.memberCount;
				default: return new Date(b.createdAt) - new Date(a.createdAt);
			}
		});
		return result;
	}, [
		searchQuery,
		departmentFilter,
		managerFilter,
		statusFilter,
		dateFrom,
		dateTo,
		sortBy
	]);
	const totalPages = Math.ceil(filteredTeams.length / pageSize);
	const paginatedTeams = filteredTeams.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const summary = (0, import_react.useMemo)(() => ({
		totalTeams: filteredTeams.length,
		avgProductivity: filteredTeams.length ? Math.round(filteredTeams.reduce((s, t) => s + t.productivityPercent, 0) / filteredTeams.length) : 0,
		totalMembers: filteredTeams.reduce((s, t) => s + t.memberCount, 0)
	}), [filteredTeams]);
	const handlePageChange = (page) => {
		setLoading(true);
		setTimeout(() => {
			setCurrentPage(page);
			setLoading(false);
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}, 300);
	};
	const handlePageSizeChange = (size) => {
		setPageSize(size);
		setCurrentPage(1);
	};
	const handleAction = (action, team) => {
		addNotification({
			view: `Opening details for ${team.name}`,
			edit: `Editing ${team.name}`,
			assign: `Assign members to ${team.name}`,
			export: `Exporting data for ${team.name}`,
			delete: `Delete request for ${team.name}`
		}[action] || "Action completed", action === "delete" ? "warning" : "info");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-1 fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-3 col-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm h-100",
							style: { borderRadius: 16 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted small fw-bold text-uppercase mb-2",
									children: "Total Teams"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center",
										style: {
											width: 40,
											height: 40
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPeopleGroup })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fs-3 fw-bold",
										children: summary.totalTeams
									})]
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-3 col-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm h-100",
							style: { borderRadius: 16 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted small fw-bold text-uppercase mb-2",
									children: "Efficiency"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center",
										style: {
											width: 40,
											height: 40
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChartLine })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fs-3 fw-bold",
										children: [summary.avgProductivity, "%"]
									})]
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-3 col-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm h-100",
							style: { borderRadius: 16 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted small fw-bold text-uppercase mb-2",
									children: "Total Members"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-circle bg-info-subtle text-info d-flex align-items-center justify-content-center",
										style: {
											width: 40,
											height: 40
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faUsers })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fs-3 fw-bold",
										children: summary.totalMembers
									})]
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-3 col-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm h-100",
							style: { borderRadius: 16 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted small fw-bold text-uppercase mb-2",
									children: "Critical Tasks"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center",
										style: {
											width: 40,
											height: 40
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBolt })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fs-3 fw-bold",
										children: "12"
									})]
								})]
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamsToolbar, {
				searchQuery,
				onSearchChange: (v) => {
					setSearchQuery(v);
					setCurrentPage(1);
				},
				viewMode,
				onViewModeChange: setViewMode,
				sortBy,
				onSortChange: (v) => {
					setSortBy(v);
					setCurrentPage(1);
				},
				onAddNew: () => addNotification("Adding new team...", "info"),
				onToggleFilters: () => setShowFilters(!showFilters),
				showFilters,
				activeFilterCount
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamGrid, {
					teams: paginatedTeams,
					viewMode,
					onAction: handleAction,
					loading
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamsPagination, {
				currentPage,
				totalPages,
				pageSize,
				onPageChange: handlePageChange,
				onPageSizeChange: handlePageSizeChange,
				totalItems: filteredTeams.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
					className: "fw-bold mb-4 d-flex align-items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faLightbulb,
						className: "text-warning"
					}), "AI Team Productivity Recommendations"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm h-100",
							style: {
								borderRadius: 16,
								borderLeft: "4px solid #4f46e5"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold text-primary mb-2",
									children: "Workload Rebalancing"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "small text-muted mb-0",
									children: "DevOps team is currently at 94% capacity. Consider moving non-critical tasks to the Testing team to avoid burnout."
								})]
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm h-100",
							style: {
								borderRadius: 16,
								borderLeft: "4px solid #f59e0b"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold text-warning mb-2",
									children: "Efficiency Insight"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "small text-muted mb-0",
									children: "UX Research shows a 15% increase in manual hours this week. Recommend automated reporting tools to save time."
								})]
							})
						})
					})]
				})]
			})
		]
	});
};
//#endregion
export { TeamsProductivityDashboard as default };
