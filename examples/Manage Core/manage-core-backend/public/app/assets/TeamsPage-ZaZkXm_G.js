import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, Yt as faChartLine, bl as useApp, lt as faBolt, pa as faLightbulb, ru as require_react, sr as faDownload, tl as faUsers, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { a as SAMPLE_TEAMS, i as MANAGERS, r as DEPARTMENTS, s as TEAM_STATUSES, t as TeamsPagination } from "./TeamsPagination-BwYWdQRl.js";
import { t as TeamsTable } from "./TeamsTable-O0E4abSV.js";
import { n as TeamsToolbar, t as TeamGrid } from "./TeamGrid-XDmhIyOm.js";
//#region src/pages/organization/teams/TeamsPage.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var TeamsPage = () => {
	const { addNotification } = useApp();
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [viewMode, setViewMode] = (0, import_react.useState)("table");
	const [sortBy, setSortBy] = (0, import_react.useState)("newest");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const [pageSize, setPageSize] = (0, import_react.useState)(10);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [initialLoading] = (0, import_react.useState)(false);
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
	const handleSearchChange = (v) => {
		setSearchQuery(v);
		setCurrentPage(1);
	};
	const handleSortChange = (v) => {
		setSortBy(v);
		setCurrentPage(1);
	};
	const handleFilterChange = (setter, value) => {
		setter(value);
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
	const handleAddNew = () => {
		addNotification("Create Team wizard coming soon.", "info");
	};
	const handleExportAll = () => {
		const csv = [[
			"Team",
			"Department",
			"Manager",
			"Members",
			"Total Worked",
			"Productive",
			"Manual",
			"Unproductive",
			"Efficiency %"
		].join(","), ...filteredTeams.map((t) => [
			t.name,
			t.department,
			t.manager,
			t.memberCount,
			t.totalWorked,
			t.productive,
			t.manual,
			t.unproductive,
			t.efficiency
		].join(","))].join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `teams-productivity-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
		link.click();
		URL.revokeObjectURL(url);
		addNotification("Teams data exported to CSV.", "success");
	};
	const handleClearFilters = () => {
		setDepartmentFilter("All Departments");
		setManagerFilter("All Managers");
		setStatusFilter("All Status");
		setDateFrom("");
		setDateTo("");
		setCurrentPage(1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-1 fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-4 col-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm h-100",
							style: { borderRadius: 15 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body d-flex align-items-center gap-3 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center",
									style: {
										width: 44,
										height: 44
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faUsers })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold fs-5",
									children: summary.totalTeams
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted small",
									children: "Active Teams"
								})] })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-4 col-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm h-100",
							style: { borderRadius: 15 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body d-flex align-items-center gap-3 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-3 bg-success-subtle text-success d-flex align-items-center justify-content-center",
									style: {
										width: 44,
										height: 44
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChartLine })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "fw-bold fs-5",
									children: [summary.avgProductivity, "%"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted small",
									children: "Avg Productivity"
								})] })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-4 col-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm h-100",
							style: { borderRadius: 15 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body d-flex align-items-center gap-3 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-3 bg-warning-subtle text-warning d-flex align-items-center justify-content-center",
									style: {
										width: 44,
										height: 44
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBolt })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold fs-5",
									children: summary.totalMembers
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted small",
									children: "Total Members"
								})] })]
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "alert alert-primary border-0 shadow-sm d-flex align-items-start gap-3 mb-4",
				style: { borderRadius: 15 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faLightbulb,
						className: "mt-1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "small",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "AI Team Insight:" }), " DevOps and Cloud Computing teams show the highest productivity this month. IT Support has elevated manual hours — consider workload rebalancing."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn btn-outline-primary btn-sm ms-auto flex-shrink-0",
						onClick: handleExportAll,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faDownload,
							className: "me-1"
						}), "Export"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamsToolbar, {
				searchQuery,
				onSearchChange: handleSearchChange,
				viewMode,
				onViewModeChange: setViewMode,
				sortBy,
				onSortChange: handleSortChange,
				onAddNew: handleAddNew,
				onToggleFilters: () => setShowFilters((s) => !s),
				showFilters,
				activeFilterCount
			}),
			showFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm mb-4",
				style: { borderRadius: 15 },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3 align-items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "form-label small text-muted fw-bold text-uppercase",
									children: "Department"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "form-select",
									value: departmentFilter,
									onChange: (e) => handleFilterChange(setDepartmentFilter, e.target.value),
									children: DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "form-label small text-muted fw-bold text-uppercase",
									children: "Manager"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "form-select",
									value: managerFilter,
									onChange: (e) => handleFilterChange(setManagerFilter, e.target.value),
									children: MANAGERS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: m }, m))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "form-label small text-muted fw-bold text-uppercase",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "form-select",
									value: statusFilter,
									onChange: (e) => handleFilterChange(setStatusFilter, e.target.value),
									children: TEAM_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "form-label small text-muted fw-bold text-uppercase",
									children: "From"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									className: "form-control",
									value: dateFrom,
									onChange: (e) => handleFilterChange(setDateFrom, e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "form-label small text-muted fw-bold text-uppercase",
									children: "To"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									className: "form-control",
									value: dateTo,
									onChange: (e) => handleFilterChange(setDateTo, e.target.value)
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-end mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-link btn-sm",
							onClick: handleClearFilters,
							children: "Clear filters"
						})
					})]
				})
			}),
			viewMode === "table" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamsTable, {
				teams: paginatedTeams,
				onAction: handleAction,
				loading
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamGrid, {
				teams: paginatedTeams,
				viewMode,
				onAction: handleAction,
				loading
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamsPagination, {
				currentPage,
				totalPages,
				pageSize,
				onPageChange: handlePageChange,
				onPageSizeChange: handlePageSizeChange,
				totalItems: filteredTeams.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .x-small { font-size: 10px; }
        .transition { transition: all 0.2s ease; }
        .transition-width { transition: width 0.6s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
        .team-card { border: 1px solid rgba(0,0,0,0.06) !important; }
        .team-card:hover { border-color: rgba(99,102,241,0.25) !important; }
        .team-avatar-stack .team-avatar { transition: transform 0.2s ease; }
        .team-avatar-stack:hover .team-avatar { transform: translateY(-2px); }
      ` })
		]
	});
};
//#endregion
export { TeamsPage as default };
