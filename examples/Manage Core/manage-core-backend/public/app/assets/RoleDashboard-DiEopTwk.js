import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, Al as client, Dl as require_jsx_runtime, Hl as LineElement, Il as BarElement, Jl as RadialLinearScale, Kl as PointElement, Pl as ArcElement, Rl as CategoryScale, Ul as LinearScale, Zl as index, d as useTranslation, eu as plugin_title, f as Bar, g as Radar, kl as clearCache, m as Line, p as Doughnut, ru as require_react, tu as plugin_tooltip, zl as Chart } from "./ai-BHgPkVLC.js";
import { $ as FiDownload, Ct as FiTrash2, Dt as FiUsers, L as FiActivity, at as FiInfo, bt as FiSettings, ct as FiLock, gt as FiRefreshCw, mt as FiPieChart, xt as FiShield, z as FiAlertTriangle } from "./superadmin-Cn5Mt1aQ.js";
//#region src/pages/Permissions&Modules/RoleDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, ArcElement, index, plugin_title, plugin_tooltip, plugin_legend);
var RoleDashboard = ({ isDark = false, colors: propColors = null, addNotification = null }) => {
	const { t } = useTranslation();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [purging, setPurging] = (0, import_react.useState)(false);
	const [exportDropdownOpen, setExportDropdownOpen] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)({
		show: false,
		message: "",
		type: ""
	});
	const [metrics, setMetrics] = (0, import_react.useState)([
		{
			label: "Total Roles",
			value: 0,
			change: "Fetching...",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, {}),
			color: "#4f46e5",
			bg: "rgba(79, 70, 229, 0.1)"
		},
		{
			label: "Users Assigned",
			value: 0,
			change: "Fetching...",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUsers, {}),
			color: "#10b981",
			bg: "rgba(16, 185, 129, 0.1)"
		},
		{
			label: "Custom Roles",
			value: 0,
			change: "Fetching...",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiSettings, {}),
			color: "#f59e0b",
			bg: "rgba(245, 158, 11, 0.1)"
		},
		{
			label: "Permission Groups",
			value: 0,
			change: "Fetching...",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiLock, {}),
			color: "#8b5cf6",
			bg: "rgba(139, 92, 246, 0.1)"
		},
		{
			label: "High Access Roles",
			value: 0,
			change: "Fetching...",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiAlertTriangle, {}),
			color: "#ef4444",
			bg: "rgba(239, 68, 68, 0.1)"
		}
	]);
	const colors = propColors || {
		indigo: "#4f46e5",
		indigoLight: "#818cf8",
		indigoBg: "rgba(79,70,229,0.12)",
		emerald: "#10b981",
		emeraldLight: "#34d399",
		amber: "#f59e0b",
		amberLight: "#fbbf24",
		rose: "#ef4444",
		roseLight: "#f87171",
		purple: "#8b5cf6",
		purpleLight: "#a78bfa",
		cyan: "#06b6d4",
		cyanLight: "#22d3ee",
		pink: "#ec4899",
		pinkLight: "#f472b6",
		slate: "#64748b",
		slateLight: "#94a3b8"
	};
	const cardStyle = {
		borderRadius: "16px",
		background: isDark ? "#1e2235" : "#ffffff",
		border: isDark ? "1px solid #2d3248" : "1px solid #e2e8f0",
		color: isDark ? "#f1f5f9" : "#1e293b",
		boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 6px -1px rgba(0,0,0,0.05)",
		transition: "all 0.3s ease"
	};
	const [usersPerRoleData, setUsersPerRoleData] = (0, import_react.useState)({
		labels: [],
		datasets: [{
			label: "Users",
			data: [],
			backgroundColor: [],
			borderRadius: 6,
			borderSkipped: false
		}]
	});
	const [roleDistributionData, setRoleDistributionData] = (0, import_react.useState)({
		labels: [],
		datasets: [{
			data: [],
			backgroundColor: [
				colors.indigo,
				colors.emerald,
				colors.amber,
				colors.rose,
				colors.purple
			],
			borderWidth: 0,
			hoverOffset: 12
		}]
	});
	const [usersPerRoleSummary, setUsersPerRoleSummary] = (0, import_react.useState)([
		{
			label: "Total Users",
			value: 0,
			color: colors.indigo
		},
		{
			label: "Avg / Role",
			value: 0,
			color: colors.emerald
		},
		{
			label: "Largest",
			value: "-",
			color: colors.cyan
		}
	]);
	const [permissionCoverageData, setPermissionCoverageData] = (0, import_react.useState)({
		labels: [
			"Projects",
			"Tasks",
			"Documents",
			"Finance",
			"HR",
			"Reports",
			"Settings"
		],
		datasets: [{
			label: "Project Manager Role",
			data: [
				90,
				85,
				80,
				40,
				30,
				75,
				20
			],
			backgroundColor: "rgba(79, 70, 229, 0.2)",
			borderColor: "#4f46e5",
			pointBackgroundColor: "#4f46e5"
		}]
	});
	const [moduleUsageData, setModuleUsageData] = (0, import_react.useState)({
		labels: [
			"PMS",
			"HRMS",
			"DMS",
			"FMS",
			"CRM"
		],
		datasets: [{
			label: "Full Access",
			data: [
				12,
				8,
				10,
				5,
				15
			],
			backgroundColor: "#4f46e5"
		}, {
			label: "Read Only",
			data: [
				20,
				15,
				12,
				8,
				10
			],
			backgroundColor: "#a5b4fc"
		}]
	});
	const [heatmapData, setHeatmapData] = (0, import_react.useState)([]);
	const [inactiveRoles, setInactiveRoles] = (0, import_react.useState)([]);
	const showToast = (message, type = "success") => {
		if (addNotification) addNotification(message, type);
		else {
			setToast({
				show: true,
				message,
				type
			});
			setTimeout(() => setToast({
				show: false,
				message: "",
				type: ""
			}), 4e3);
		}
	};
	const fetchDashboardData = async () => {
		setLoading(true);
		try {
			const d = (await client.get("/roles/dashboard-stats")).data;
			setMetrics([
				{
					label: "Total Roles",
					value: d.metrics.total_roles,
					change: "Active in system",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, {}),
					color: colors.indigo,
					bg: `${colors.indigo}18`
				},
				{
					label: "Users Assigned",
					value: d.metrics.users_assigned,
					change: "Across all groups",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUsers, {}),
					color: colors.emerald,
					bg: `${colors.emerald}18`
				},
				{
					label: "Custom Roles",
					value: d.metrics.custom_roles,
					change: "Custom definitions",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiSettings, {}),
					color: colors.amber,
					bg: `${colors.amber}18`
				},
				{
					label: "Permission Groups",
					value: d.metrics.permission_groups,
					change: "Access variables",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiLock, {}),
					color: colors.purple,
					bg: `${colors.purple}18`
				},
				{
					label: "High Access Roles",
					value: d.metrics.high_access_roles,
					change: "Super/Admin profiles",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiAlertTriangle, {}),
					color: colors.rose,
					bg: `${colors.rose}18`
				}
			]);
			setUsersPerRoleData({
				labels: d.users_per_role.labels,
				datasets: [{
					label: "Users",
					data: d.users_per_role.data,
					backgroundColor: d.users_per_role.colors,
					borderRadius: 6,
					borderSkipped: false
				}]
			});
			let maxVal = -1;
			let largestRole = "-";
			d.users_per_role.labels.forEach((label, idx) => {
				const val = d.users_per_role.data[idx];
				if (val > maxVal) {
					maxVal = val;
					largestRole = `${label} (${val})`;
				}
			});
			setUsersPerRoleSummary([
				{
					label: "Total Users",
					value: d.users_per_role.total_users,
					color: colors.indigo
				},
				{
					label: "Avg / Role",
					value: d.users_per_role.avg_per_role,
					color: colors.emerald
				},
				{
					label: "Largest",
					value: largestRole,
					color: colors.cyan
				}
			]);
			setRoleDistributionData({
				labels: Object.keys(d.role_distribution),
				datasets: [{
					data: Object.values(d.role_distribution),
					backgroundColor: [
						colors.indigo,
						colors.emerald,
						colors.amber,
						colors.rose,
						colors.purple
					],
					borderWidth: 0,
					hoverOffset: 12
				}]
			});
			setHeatmapData(d.heatmap);
			setInactiveRoles(d.inactive_roles);
		} catch (err) {
			console.error("Failed to load roles dashboard statistics", err);
			showToast("Failed to load live roles dashboard stats.", "error");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchDashboardData();
	}, []);
	const handlePurgeUnused = async () => {
		setPurging(true);
		try {
			const res = await client.post("/roles/purge-unused");
			clearCache("/roles");
			showToast(res.data?.message || "Purged unused roles successfully.");
			fetchDashboardData();
		} catch (err) {
			console.error("Purging failed:", err);
			showToast(err.response?.data?.message || "Purge request failed.", "error");
		} finally {
			setPurging(false);
		}
	};
	const handleExport = (format) => {
		setExportDropdownOpen(false);
		const dataToExport = {
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			metrics: metrics.reduce((acc, curr) => ({
				...acc,
				[curr.label]: curr.value
			}), {}),
			distribution: roleDistributionData.labels.reduce((acc, curr, idx) => ({
				...acc,
				[curr]: roleDistributionData.datasets[0].data[idx] + "%"
			}), {}),
			inactive: inactiveRoles
		};
		if (format === "json") {
			const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `role_dashboard_export_${Date.now()}.json`;
			a.click();
			showToast("JSON Config report downloaded.");
		} else if (format === "csv") {
			let csv = "Metric,Value\n";
			metrics.forEach((m) => {
				csv += `"${m.label}","${m.value}"\n`;
			});
			csv += "\nRole Distribution,Percentage\n";
			roleDistributionData.labels.forEach((label, idx) => {
				csv += `"${label}","${roleDistributionData.datasets[0].data[idx]}%"\n`;
			});
			csv += "\nInactive Roles,Assigned Users,Status\n";
			inactiveRoles.forEach((r) => {
				csv += `"${r.name}","${r.users}","${r.status}"\n`;
			});
			const blob = new Blob([csv], { type: "text/csv" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `role_dashboard_report_${Date.now()}.csv`;
			a.click();
			showToast("Excel-compatible CSV downloaded.");
		} else if (format === "print") window.print();
	};
	const getHeatmapColor = (value) => {
		if (value >= 100) return colors.indigo;
		if (value >= 70) return colors.indigoLight;
		if (value >= 40) return isDark ? "#312e81" : "#c7d2fe";
		if (value > 0) return isDark ? "#1e1b4b" : "#e0e7ff";
		return isDark ? "#0f172a" : "#f8fafc";
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex flex-column align-items-center justify-content-center py-5",
		style: { minHeight: "300px" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "spinner-border text-primary mb-3",
			role: "status",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "visually-hidden",
				children: "Loading dashboard..."
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-muted small",
			children: "Loading live system configuration & statistics..."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "role-dashboard-container p-1",
		children: [
			toast.show && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `alert alert-${toast.type === "error" ? "danger" : "success"} fade show position-fixed top-0 end-0 m-3 shadow`,
				style: {
					zIndex: 9999,
					borderRadius: "12px"
				},
				role: "alert",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiInfo, { className: "me-2" }),
					" ",
					toast.message
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-0",
					style: { color: isDark ? "#f8fafc" : "#0f172a" },
					children: "Role Management Studio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted extra-small mb-0",
					children: "Monitor permission nodes, module density, access control levels, and role metrics."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2 position-relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: fetchDashboardData,
							className: "btn btn-sm btn-outline-secondary rounded-pill px-3 extra-small d-flex align-items-center gap-1",
							style: {
								borderColor: isDark ? "#334155" : "#cbd5e1",
								color: isDark ? "#cbd5e1" : "#475569"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiRefreshCw, { className: "me-1" }), " Refresh"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setExportDropdownOpen(!exportDropdownOpen),
							className: "btn btn-sm btn-primary rounded-pill px-3 extra-small d-flex align-items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiDownload, { className: "me-1" }), " Export Report"]
						}),
						exportDropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `dropdown-menu show position-absolute end-0 mt-5 p-2 shadow-lg border-0`,
							style: {
								background: isDark ? "#1e2235" : "#ffffff",
								zIndex: 1e3,
								borderRadius: "12px"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "dropdown-item extra-small d-flex align-items-center gap-2",
									style: { color: isDark ? "#cbd5e1" : "#334155" },
									onClick: () => handleExport("csv"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiPieChart, {}), " Excel (CSV)"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "dropdown-item extra-small d-flex align-items-center gap-2",
									style: { color: isDark ? "#cbd5e1" : "#334155" },
									onClick: () => handleExport("json"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiSettings, {}), " JSON Config"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "dropdown-item extra-small d-flex align-items-center gap-2",
									style: { color: isDark ? "#cbd5e1" : "#334155" },
									onClick: () => handleExport("print"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiActivity, {}), " Print report"]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: metrics.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card h-100 border-0",
						style: cardStyle,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-start mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-circle d-flex align-items-center justify-content-center",
										style: {
											width: 40,
											height: 40,
											backgroundColor: m.bg,
											color: m.color
										},
										children: m.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "extra-small fw-bold text-success",
										children: m.change
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "fw-bold mb-0",
									children: m.value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted extra-small fw-medium",
									children: m.label
								})
							]
						})
					})
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card h-100 border-0",
						style: cardStyle,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								style: { color: isDark ? "#f8fafc" : "#0f172a" },
								children: "Users Per Role"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "extra-small text-muted",
								children: "Distribution of user assignments across system roles"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body px-4 pt-2 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row g-2 mb-3",
								children: usersPerRoleSummary.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 rounded-3 text-center",
										style: { background: `${s.color}0d` },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fw-bold fs-5",
											style: {
												color: s.color,
												lineHeight: 1.2
											},
											children: s.value
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "extra-small text-muted",
											style: { lineHeight: 1.2 },
											children: s.label
										})]
									})
								}, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								data: usersPerRoleData,
								options: {
									indexAxis: "y",
									responsive: true,
									maintainAspectRatio: true,
									plugins: {
										legend: { display: false },
										tooltip: {
											backgroundColor: isDark ? "#0f172a" : "rgba(15,23,42,0.9)",
											titleFont: {
												size: 11,
												weight: "600"
											},
											bodyFont: { size: 12 },
											padding: {
												x: 10,
												y: 8
											},
											cornerRadius: 8,
											callbacks: { label: (ctx) => `${ctx.raw} users` }
										}
									},
									scales: {
										x: {
											grid: { color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" },
											ticks: {
												color: isDark ? "#94a3b8" : "#64748b",
												font: { size: 10 }
											}
										},
										y: {
											grid: { display: false },
											ticks: {
												color: isDark ? "#94a3b8" : "#64748b",
												font: {
													size: 10,
													weight: "600"
												}
											}
										}
									},
									animation: {
										duration: 800,
										easing: "easeOutQuart"
									}
								}
							})]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card h-100 border-0",
						style: cardStyle,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-header bg-transparent border-0 pt-4 px-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								style: { color: isDark ? "#f8fafc" : "#0f172a" },
								children: "Role Distribution"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "extra-small text-muted",
								children: "Percentage split across role categories"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body px-4 pt-2 pb-4 d-flex flex-column align-items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									position: "relative",
									width: 200,
									height: 200
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
									data: roleDistributionData,
									options: {
										cutout: "78%",
										plugins: {
											legend: { display: false },
											tooltip: {
												backgroundColor: isDark ? "#0f172a" : "rgba(15,23,42,0.9)",
												titleFont: {
													size: 11,
													weight: "600"
												},
												bodyFont: { size: 12 },
												padding: {
													x: 10,
													y: 8
												},
												cornerRadius: 8,
												callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}%` }
											}
										},
										animation: {
											animateRotate: true,
											duration: 1e3,
											easing: "easeOutQuart"
										}
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										position: "absolute",
										top: "50%",
										left: "50%",
										transform: "translate(-50%,-50%)",
										textAlign: "center",
										pointerEvents: "none"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-bold fs-3",
										style: {
											color: colors.indigo,
											lineHeight: 1
										},
										children: "100%"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "extra-small text-muted",
										style: { lineHeight: 1.2 },
										children: "Coverage"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex flex-wrap gap-3 mt-3 justify-content-center",
								children: roleDistributionData.labels.map((label, i) => {
									const bgColors = [
										colors.indigo,
										colors.emerald,
										colors.amber,
										colors.rose,
										colors.purple
									];
									const dataVals = roleDistributionData.datasets[0].data;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
											width: 10,
											height: 10,
											borderRadius: 3,
											background: bgColors[i]
										} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "extra-small fw-bold",
											style: { lineHeight: 1.1 },
											children: label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "extra-small text-muted",
											style: { lineHeight: 1.1 },
											children: [dataVals[i], "%"]
										})] })]
									}, i);
								})
							})]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card h-100 border-0",
							style: cardStyle,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "card-header bg-transparent border-0 pt-4 px-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-0",
									style: { color: isDark ? "#f8fafc" : "#0f172a" },
									children: "Permission Coverage"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "card-body p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
									data: permissionCoverageData,
									options: {
										plugins: { legend: { display: false } },
										scales: { r: {
											grid: { color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" },
											angleLines: { color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" },
											ticks: { display: false }
										} }
									}
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card h-100 border-0",
							style: cardStyle,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "card-header bg-transparent border-0 pt-4 px-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-0",
									style: { color: isDark ? "#f8fafc" : "#0f172a" },
									children: "Module Access Density"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "card-body p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									data: moduleUsageData,
									options: {
										scales: {
											x: {
												stacked: true,
												grid: { color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }
											},
											y: {
												stacked: true,
												grid: { color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }
											}
										},
										plugins: { legend: {
											position: "bottom",
											labels: {
												boxWidth: 10,
												color: isDark ? "#e2e8f0" : "#475569"
											}
										} }
									}
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card h-100 border-0",
							style: cardStyle,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "card-header bg-transparent border-0 pt-4 px-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-0",
									style: { color: isDark ? "#f8fafc" : "#0f172a" },
									children: "Access Risk Heatmap"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "table-responsive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "table table-borderless table-sm align-middle",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "extra-small text-muted text-center",
											style: { color: isDark ? "#94a3b8" : "#64748b" },
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "text-start",
													children: "Role"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "PMS" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "HRMS" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "DMS" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "FMS" })
											]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: heatmapData.map((row, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "text-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "text-start small fw-bold",
												style: { color: isDark ? "#cbd5e1" : "#334155" },
												children: row.role
											}), [
												row.pms,
												row.hrms,
												row.dms,
												row.fms
											].map((val, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-2",
												style: {
													width: "100%",
													height: "30px",
													backgroundColor: getHeatmapColor(val),
													opacity: val > 0 ? 1 : .25,
													cursor: "pointer"
												},
												title: `${row.role}: ${val}% control score`
											}) }, i))]
										}, idx)) })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 d-flex gap-3 justify-content-center flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														width: 10,
														height: 10,
														background: colors.indigo
													},
													className: "rounded-1"
												}),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "extra-small",
													children: "Full (100%)"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														width: 10,
														height: 10,
														background: colors.indigoLight
													},
													className: "rounded-1"
												}),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "extra-small",
													children: "High (70%)"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														width: 10,
														height: 10,
														background: isDark ? "#312e81" : "#c7d2fe"
													},
													className: "rounded-1"
												}),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "extra-small",
													children: "Limited"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														width: 10,
														height: 10,
														background: isDark ? "#0f172a" : "#f8fafc"
													},
													className: "rounded-1"
												}),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "extra-small",
													children: "None"
												})
											]
										})
									]
								})]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card border-0 h-100",
						style: cardStyle,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-header bg-transparent border-0 pt-4 px-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-0",
								style: { color: isDark ? "#f8fafc" : "#0f172a" },
								children: "Role Activity Trends"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-body p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								data: {
									labels: [
										"Jan",
										"Feb",
										"Mar",
										"Apr",
										"May",
										"Jun"
									],
									datasets: [{
										label: "Actions Performed",
										data: [
											1200,
											1900,
											1500,
											2100,
											2400,
											2800
										],
										borderColor: colors.indigo,
										tension: .4,
										fill: true,
										backgroundColor: `${colors.indigo}15`
									}]
								},
								options: {
									plugins: { legend: { display: false } },
									scales: {
										x: {
											grid: { color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" },
											ticks: { color: isDark ? "#94a3b8" : "#64748b" }
										},
										y: {
											beginAtZero: true,
											grid: { color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" },
											ticks: { color: isDark ? "#94a3b8" : "#64748b" }
										}
									}
								}
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card border-0 h-100",
						style: cardStyle,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-0",
								style: { color: isDark ? "#f8fafc" : "#0f172a" },
								children: "Inactive Roles Analysis"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handlePurgeUnused,
								disabled: purging,
								className: "btn btn-outline-danger btn-xs px-2 py-1 extra-small rounded-pill d-flex align-items-center gap-1",
								children: purging ? "Purging..." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiTrash2, {}), " Clean Stale"] })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-body p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "table-responsive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "table table-hover align-middle mb-0",
									style: { background: "transparent" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "extra-small text-muted",
										style: { color: isDark ? "#cbd5e1" : "#64748b" },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Role Name" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Users" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Last Action" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: inactiveRoles.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										style: { borderBottom: isDark ? "1px solid #334155" : "1px solid #e2e8f0" },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "small fw-bold",
												style: { color: isDark ? "#cbd5e1" : "#334155" },
												children: r.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "small",
												style: { color: isDark ? "#cbd5e1" : "#334155" },
												children: r.users
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "extra-small text-muted",
												children: r.last
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `badge extra-small ${isDark ? "bg-secondary text-light" : "bg-light text-muted"}`,
												children: r.status
											}) })
										]
									}, i)) })]
								})
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
                .extra-small { font-size: 10px; }
                .btn-xs { padding: 2px 6px; font-size: 10px; }
            ` } })
		]
	});
};
//#endregion
export { RoleDashboard as default };
