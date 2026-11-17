import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Cn as faClock, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Ds as faSliders, G as faArrowUp, Kn as faCreditCard, Lo as faReceipt, M as faArrowDown, Mi as faHardDrive, Ui as faHistory, Wr as faFileInvoiceDollar, Xc as faUserShield, Xo as faRotateLeft, Xt as faChartPie, Yc as faUserSecret, Yt as faChartLine, Zn as faDatabase, aa as faKey, ba as faLock, da as faLayerGroup, dn as faCircleInfo, gs as faShieldHalved, ii as faFlag, is as faScaleBalanced, kn as faCloudArrowUp, lt as faBolt, ni as faFingerprint, ot as faBell, pl as faWifi, qo as faRobot, ru as require_react, sn as faCircleCheck, tl as faUsers, us as faServer, v as motion, va as faListCheck, vi as faGear, vl as FontAwesomeIcon, wa as faMagnifyingGlass, xc as faTriangleExclamation, xi as faGlobe, y as AnimatePresence, yt as faBrain } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/Drawing/DrawingEnterpriseAdmin.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PALETTE = {
	primary: "#6366f1",
	success: "#10b981",
	danger: "#f43f5e",
	warning: "#f59e0b",
	info: "#06b6d4",
	purple: "#8b5cf6"
};
var cardStyle = (isDark) => ({
	background: isDark ? "rgba(30,41,59,0.7)" : "#ffffff",
	border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
	borderRadius: 16,
	padding: 20,
	boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.35)" : "0 4px 16px rgba(15,23,42,0.06)"
});
var inputStyle = (isDark) => ({
	width: "100%",
	padding: "9px 14px",
	borderRadius: 10,
	border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#d8dee9"}`,
	background: isDark ? "rgba(255,255,255,0.04)" : "#fff",
	color: isDark ? "#e2e8f0" : "#1e293b",
	fontSize: 13,
	outline: "none"
});
var Kpi = ({ icon, label, value, trend, color, isDark }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	style: cardStyle(isDark),
	className: "h-100",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex align-items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					width: 42,
					height: 42,
					borderRadius: 11,
					background: `${color}18`,
					color,
					fontSize: 16,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted text-uppercase",
				style: {
					fontSize: 10,
					fontWeight: 600,
					letterSpacing: "0.04em"
				},
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fw-bold",
				style: {
					fontSize: 22,
					lineHeight: 1.1,
					color: isDark ? "#f1f5f9" : "#0f172a"
				},
				children: value
			})] }),
			trend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "ms-auto x-small fw-bold",
				style: { color: trend.startsWith("-") ? PALETTE.danger : PALETTE.success },
				children: [
					trend.startsWith("-") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faArrowDown }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faArrowUp }),
					" ",
					trend
				]
			})
		]
	})
});
var SectionHeader = ({ icon, title, color, isDark, desc }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "d-flex align-items-center gap-3 mb-3",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			width: 34,
			height: 34,
			borderRadius: 10,
			background: `${color}15`,
			color,
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
		className: "fw-bold mb-0",
		style: {
			color: isDark ? "#e2e8f0" : "#1e293b",
			fontSize: 15
		},
		children: title
	}), desc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-muted",
		style: { fontSize: 11.5 },
		children: desc
	})] })]
});
var StatusBadge = ({ status, isDark }) => {
	const c = {
		Healthy: PALETTE.success,
		Active: PALETTE.success,
		Running: PALETTE.success,
		Warning: PALETTE.warning,
		Paused: PALETTE.warning,
		Pending: PALETTE.warning,
		Critical: PALETTE.danger,
		Failed: PALETTE.danger,
		Suspended: PALETTE.danger,
		Completed: PALETTE.info,
		Approved: PALETTE.info
	}[status] || PALETTE.info;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "badge rounded-pill px-2 py-1 fw-bold",
		style: {
			background: `${c}1a`,
			color: c,
			fontSize: 10
		},
		children: status
	});
};
var ROWS = [
	{
		id: "overview",
		label: "Enterprise Overview",
		icon: faBuilding
	},
	{
		id: "companies",
		label: "Company Management",
		icon: faUsers
	},
	{
		id: "licensing",
		label: "Licensing & Billing",
		icon: faScaleBalanced
	},
	{
		id: "security",
		label: "Security Center",
		icon: faShieldHalved
	},
	{
		id: "compliance",
		label: "Compliance & Governance",
		icon: faUserShield
	},
	{
		id: "monitoring",
		label: "System Monitoring",
		icon: faServer
	},
	{
		id: "aigovernance",
		label: "AI Governance",
		icon: faRobot
	},
	{
		id: "backup",
		label: "Backup & Disaster Recovery",
		icon: faDatabase
	},
	{
		id: "analytics",
		label: "Analytics & BI",
		icon: faChartLine
	},
	{
		id: "audit",
		label: "Audit Logs",
		icon: faHistory
	},
	{
		id: "notifications",
		label: "Notification Center",
		icon: faBell
	},
	{
		id: "featureflags",
		label: "Feature Flags",
		icon: faFlag
	},
	{
		id: "tools",
		label: "Super Admin Tools",
		icon: faGear
	}
];
var DrawingEnterpriseAdmin = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const [active, setActive] = (0, import_react.useState)("overview");
	const [search, setSearch] = (0, import_react.useState)("");
	const [featureFlags, setFeatureFlags] = (0, import_react.useState)(() => {
		const s = localStorage.getItem("drawing_admin_flags");
		return s ? JSON.parse(s) : {
			realTimeCollab: true,
			aiAssistant: true,
			plugins: false,
			mcp: false,
			betaExports: false,
			publicSharing: true,
			offlineMode: true,
			auditMode: true
		};
	});
	const [companies, setCompanies] = (0, import_react.useState)(() => {
		const s = localStorage.getItem("drawing_admin_companies");
		return s ? JSON.parse(s) : [
			{
				id: "c1",
				name: "Stark Industries",
				plan: "Enterprise",
				status: "Active",
				users: 1240,
				storage: "842 GB",
				drawings: 3210
			},
			{
				id: "c2",
				name: "Wayne Enterprises",
				plan: "Business",
				status: "Active",
				users: 540,
				storage: "310 GB",
				drawings: 1402
			},
			{
				id: "c3",
				name: "Acme Corp",
				plan: "Trial",
				status: "Trial",
				users: 18,
				storage: "12 GB",
				drawings: 64
			},
			{
				id: "c4",
				name: "Globex",
				plan: "Professional",
				status: "Suspended",
				users: 220,
				storage: "120 GB",
				drawings: 510
			}
		];
	});
	(0, import_react.useEffect)(() => {
		localStorage.setItem("drawing_admin_flags", JSON.stringify(featureFlags));
	}, [featureFlags]);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("drawing_admin_companies", JSON.stringify(companies));
	}, [companies]);
	const toggleFlag = (k) => setFeatureFlags((prev) => ({
		...prev,
		[k]: !prev[k]
	}));
	const auditLogs = [
		{
			user: "superadmin@managecore.com",
			action: "Company Updated",
			detail: "Globex status → Suspended",
			time: "2026-07-17 09:14",
			ip: "203.0.113.22"
		},
		{
			user: "tony@stark.io",
			action: "AI Usage",
			detail: "Generated architecture diagram",
			time: "2026-07-17 08:52",
			ip: "198.51.100.7"
		},
		{
			user: "superadmin@managecore.com",
			action: "License Changed",
			detail: "Acme Corp → Trial",
			time: "2026-07-16 17:30",
			ip: "203.0.113.22"
		},
		{
			user: "nat@wayne.com",
			action: "Export",
			detail: "Presentation → PPTX",
			time: "2026-07-16 15:11",
			ip: "192.0.2.45"
		},
		{
			user: "bruce@stark.io",
			action: "Permission Change",
			detail: "Granted Designer role",
			time: "2026-07-16 11:02",
			ip: "198.51.100.9"
		}
	];
	const threatFeeds = [
		{
			sev: "Critical",
			msg: "Repeated failed logins from 185.220.101.x",
			time: "2m ago"
		},
		{
			sev: "Warning",
			msg: "API rate limit exceeded for Globex tenant",
			time: "18m ago"
		},
		{
			sev: "Info",
			msg: "New device authorized: iPad Pro (nat@wayne.com)",
			time: "1h ago"
		}
	];
	const renderOverview = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-4 col-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							icon: faBuilding,
							label: "Total Companies",
							value: companies.length,
							trend: "+2",
							color: PALETTE.primary,
							isDark
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-4 col-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							icon: faUsers,
							label: "Active Users",
							value: "14,930",
							trend: "+5.2%",
							color: PALETTE.info,
							isDark
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-4 col-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							icon: faHardDrive,
							label: "Storage Used",
							value: "2.1 TB",
							trend: "+8%",
							color: PALETTE.warning,
							isDark
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-4 col-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							icon: faRobot,
							label: "AI Requests",
							value: "128K",
							trend: "+21%",
							color: PALETTE.purple,
							isDark
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: cardStyle(isDark),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							icon: faServer,
							title: "System Health",
							color: PALETTE.success,
							isDark,
							desc: "Real-time infrastructure status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row g-3",
							children: [
								{
									n: "CPU Usage",
									v: "34%",
									c: PALETTE.success
								},
								{
									n: "Memory",
									v: "61%",
									c: PALETTE.warning
								},
								{
									n: "Disk I/O",
									v: "22%",
									c: PALETTE.info
								},
								{
									n: "Bandwidth",
									v: "480 Mbps",
									c: PALETTE.primary
								},
								{
									n: "API Requests",
									v: "9.2K/min",
									c: PALETTE.purple
								},
								{
									n: "Queue Depth",
									v: "12",
									c: PALETTE.success
								}
							].map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-3 p-3",
									style: { background: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted x-small fw-bold text-uppercase",
											children: m.n
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fw-bold",
											style: {
												fontSize: 18,
												color: isDark ? "#e2e8f0" : "#0f172a"
											},
											children: m.v
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2",
											style: {
												height: 4,
												borderRadius: 2,
												background: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
												overflow: "hidden"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
												width: Math.min(100, parseInt(m.v) || 40) + "%",
												height: "100%",
												background: m.c
											} })
										})
									]
								})
							}, i))
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: cardStyle(isDark),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							icon: faTriangleExclamation,
							title: "Security Alerts",
							color: PALETTE.danger,
							isDark
						}), threatFeeds.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-start gap-2 mb-2 pb-2",
							style: { borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#eef2f7"}` },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge rounded-pill mt-1",
								style: {
									background: (t.sev === "Critical" ? PALETTE.danger : t.sev === "Warning" ? PALETTE.warning : PALETTE.info) + "22",
									color: t.sev === "Critical" ? PALETTE.danger : t.sev === "Warning" ? PALETTE.warning : PALETTE.info,
									fontSize: 9
								},
								children: t.sev
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "x-small",
								style: { color: isDark ? "#e2e8f0" : "#1e293b" },
								children: t.msg
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "x-small text-muted",
								children: t.time
							})] })]
						}, i))]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: cardStyle(isDark),
							className: "d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCircleCheck,
								className: "text-success"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold",
								style: { color: isDark ? "#e2e8f0" : "#0f172a" },
								children: "System Healthy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "x-small text-muted",
								children: "All regions operational"
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: cardStyle(isDark),
							className: "d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faClock,
								className: "text-warning"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold",
								style: { color: isDark ? "#e2e8f0" : "#0f172a" },
								children: "99.99% Uptime"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "x-small text-muted",
								children: "30-day rolling"
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: cardStyle(isDark),
							className: "d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faBolt,
								className: "text-info"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold",
								style: { color: isDark ? "#e2e8f0" : "#0f172a" },
								children: "8 Automation Runs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "x-small text-muted",
								children: "Last 24 hours"
							})] })]
						})
					})
				]
			})
		]
	});
	const renderCompanies = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			icon: faUsers,
			title: "Company Management",
			color: PALETTE.primary,
			isDark,
			desc: "Multi-tenant isolation, branding, lifecycle"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3 mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-pill w-100 fw-bold",
						style: {
							background: PALETTE.primary,
							border: "none"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPlus,
							className: "me-1"
						}), "Create Company"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn rounded-pill w-100 fw-bold",
						style: {
							background: isDark ? "#334155" : "#f1f5f9",
							color: isDark ? "#e2e8f0" : "#1e293b",
							border: "none"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faCloudArrowUp,
							className: "me-1"
						}), "Clone Company"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn rounded-pill w-100 fw-bold",
						style: {
							background: isDark ? "#334155" : "#f1f5f9",
							color: isDark ? "#e2e8f0" : "#1e293b",
							border: "none"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faGlobe,
							className: "me-1"
						}), "Custom Domain"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn rounded-pill w-100 fw-bold",
						style: {
							background: isDark ? "#334155" : "#f1f5f9",
							color: isDark ? "#e2e8f0" : "#1e293b",
							border: "none"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPaintBrush ?? faSliders,
							className: "me-1"
						}), "Branding"]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: cardStyle(isDark),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "table-responsive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "table align-middle mb-0",
					style: { fontSize: 13 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-uppercase",
						style: {
							fontSize: 10,
							letterSpacing: "0.05em",
							color: "#94a3b8"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Company" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Plan" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Users" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Storage" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Drawings" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Actions" })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: companies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "fw-semibold",
							style: { color: isDark ? "#e2e8f0" : "#1e293b" },
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: c.plan }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: c.status,
							isDark
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: c.users.toLocaleString() }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: c.storage }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: c.drawings.toLocaleString() }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-sm rounded-pill px-3",
							style: {
								background: `${PALETTE.danger}15`,
								color: PALETTE.danger,
								fontSize: 11
							},
							onClick: () => setCompanies((prev) => prev.map((x) => x.id === c.id ? {
								...x,
								status: x.status === "Suspended" ? "Active" : "Suspended"
							} : x)),
							children: c.status === "Suspended" ? "Activate" : "Suspend"
						}) })
					] }, c.id)) })]
				})
			})
		})
	] });
	const renderLicensing = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			icon: faScaleBalanced,
			title: "Licensing & Billing",
			color: PALETTE.purple,
			isDark,
			desc: "Plans, feature limits, subscriptions & payment gateways"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "row g-3 mb-3",
			children: [
				{
					p: "Free",
					users: 5,
					storage: "5 GB",
					ai: 100,
					c: PALETTE.info
				},
				{
					p: "Starter",
					users: 25,
					storage: "50 GB",
					ai: 1e3,
					c: PALETTE.success
				},
				{
					p: "Professional",
					users: 250,
					storage: "500 GB",
					ai: 1e4,
					c: PALETTE.primary
				},
				{
					p: "Enterprise",
					users: "Unlimited",
					storage: "5 TB",
					ai: "Unlimited",
					c: PALETTE.purple
				}
			].map((pl, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-md-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: cardStyle(isDark),
					className: "h-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fw-bold",
							style: {
								color: pl.c,
								fontSize: 16
							},
							children: pl.p
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "my-2",
							style: {
								height: 3,
								borderRadius: 2,
								background: pl.c
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "x-small text-muted",
							children: ["Max Users: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								style: { color: isDark ? "#e2e8f0" : "#1e293b" },
								children: pl.users
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "x-small text-muted",
							children: ["Storage: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								style: { color: isDark ? "#e2e8f0" : "#1e293b" },
								children: pl.storage
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "x-small text-muted",
							children: ["AI Credits: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								style: { color: isDark ? "#e2e8f0" : "#1e293b" },
								children: pl.ai
							})]
						})
					]
				})
			}, i))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fw-bold mb-2",
					style: { color: isDark ? "#e2e8f0" : "#1e293b" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faCreditCard,
						className: "me-2",
						style: { color: PALETTE.purple }
					}), "Payment Gateways"]
				}), [
					"Stripe",
					"PayPal",
					"Paddle",
					"Razorpay",
					"Payoneer",
					"Wise",
					"Bank Transfer"
				].map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center justify-content-between mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "x-small",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: g
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
						status: i < 3 ? "Active" : "Pending",
						isDark
					})]
				}, i))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "fw-bold mb-2",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faReceipt,
							className: "me-2",
							style: { color: PALETTE.success }
						}), "Billing Summary"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3 p-3",
								style: { background: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "x-small text-muted",
									children: "MRR"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold",
									style: { color: isDark ? "#e2e8f0" : "#0f172a" },
									children: "$71,500"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3 p-3",
								style: { background: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "x-small text-muted",
									children: "ARR"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold",
									style: { color: isDark ? "#e2e8f0" : "#0f172a" },
									children: "$858,000"
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "x-small text-muted mt-2",
						children: "Billing cycles: Monthly · Quarterly · Yearly · Custom"
					})
				]
			})]
		})
	] });
	const renderSecurity = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			icon: faShieldHalved,
			title: "Security Center",
			color: PALETTE.danger,
			isDark,
			desc: "Threat detection, auth, MFA, sessions & devices"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3 mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faUserSecret,
						label: "Failed Logins",
						value: "37",
						trend: "-12%",
						color: PALETTE.danger,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faTriangleExclamation,
						label: "Suspicious",
						value: "3",
						color: PALETTE.warning,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faFingerprint,
						label: "MFA Enabled",
						value: "94%",
						color: PALETTE.success,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faLock,
						label: "Encrypted",
						value: "100%",
						color: PALETTE.info,
						isDark
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "fw-bold mb-2",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faKey,
							className: "me-2",
							style: { color: PALETTE.warning }
						}), "Authentication Methods"]
					}),
					[
						"Email / Password",
						"Google SSO",
						"Microsoft 365",
						"GitHub",
						"SAML / OIDC",
						"LDAP / Active Directory"
					].map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-center mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "x-small",
							style: { color: isDark ? "#e2e8f0" : "#1e293b" },
							children: a
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: i < 5 ? "Active" : "Pending",
							isDark
						})]
					}, i)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { style: { borderColor: isDark ? "rgba(255,255,255,0.06)" : "#eef2f7" } }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "fw-bold mb-2",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: "Multi-Factor Auth"
					}),
					[
						"Authenticator App",
						"SMS OTP",
						"Email OTP",
						"Passkeys",
						"Hardware Key",
						"Biometric"
					].map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-center mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "x-small",
							style: { color: isDark ? "#e2e8f0" : "#1e293b" },
							children: a
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: i % 2 === 0 ? "Active" : "Pending",
							isDark
						})]
					}, i))
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fw-bold mb-2",
					style: { color: isDark ? "#e2e8f0" : "#1e293b" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faWifi,
						className: "me-2",
						style: { color: PALETTE.info }
					}), "Active Sessions"]
				}), [
					{
						u: "Tony Stark",
						d: "Chrome · macOS",
						ip: "198.51.100.7",
						loc: "New York"
					},
					{
						u: "Natasha R.",
						d: "Edge · Windows",
						ip: "192.0.2.45",
						loc: "London"
					},
					{
						u: "Bruce B.",
						d: "Safari · iPad",
						ip: "203.0.113.9",
						loc: "Bangalore"
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center justify-content-between mb-2 pb-2",
					style: { borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#eef2f7"}` },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "x-small fw-bold",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: s.u
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "x-small text-muted",
						children: [
							s.d,
							" · ",
							s.ip,
							" · ",
							s.loc
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-sm rounded-pill px-2",
						style: {
							background: `${PALETTE.danger}15`,
							color: PALETTE.danger,
							fontSize: 10
						},
						children: "Terminate"
					})]
				}, i))]
			})]
		})
	] });
	const renderCompliance = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			icon: faUserShield,
			title: "Compliance & Governance",
			color: PALETTE.info,
			isDark,
			desc: "Frameworks, data governance, encryption"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "row g-3 mb-3",
			children: [
				"GDPR",
				"HIPAA",
				"SOC 2",
				"ISO 27001",
				"PCI DSS",
				"CCPA",
				"FERPA"
			].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-md-4 col-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: cardStyle(isDark),
					className: "d-flex align-items-center justify-content-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "fw-bold",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: c
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
						status: i < 5 ? "Active" : "Pending",
						isDark
					})]
				})
			}, i))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fw-bold mb-2",
					style: { color: isDark ? "#e2e8f0" : "#1e293b" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faLock,
						className: "me-2",
						style: { color: PALETTE.success }
					}), "Encryption"]
				}), [
					"AES-256 (At Rest)",
					"TLS 1.3 (In Transit)",
					"Key Rotation",
					"Key Vault",
					"Secrets Management"
				].map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "x-small",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: e
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
						status: "Active",
						isDark
					})]
				}, i))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fw-bold mb-2",
					style: { color: isDark ? "#e2e8f0" : "#1e293b" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faDatabase,
						className: "me-2",
						style: { color: PALETTE.warning }
					}), "Data Governance"]
				}), [
					"Retention Policies",
					"Data Classification",
					"Data Residency",
					"Legal Hold",
					"Recovery Policy"
				].map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "x-small",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: e
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
						status: i < 4 ? "Active" : "Pending",
						isDark
					})]
				}, i))]
			})]
		})
	] });
	const renderMonitoring = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			icon: faServer,
			title: "System Monitoring",
			color: PALETTE.primary,
			isDark,
			desc: "Application health, errors, queues"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "row g-3 mb-3",
			children: [
				{
					n: "App Errors",
					v: "0",
					c: PALETTE.success
				},
				{
					n: "API Errors",
					v: "2",
					c: PALETTE.warning
				},
				{
					n: "Plugin Errors",
					v: "0",
					c: PALETTE.success
				},
				{
					n: "Background Jobs",
					v: "148",
					c: PALETTE.info
				}
			].map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-md-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					icon: faCircleInfo,
					label: m.n,
					value: m.v,
					color: m.c,
					isDark
				})
			}, i))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: cardStyle(isDark),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fw-bold mb-3",
				style: { color: isDark ? "#e2e8f0" : "#1e293b" },
				children: "Application Health"
			}), [
				{
					s: "Healthy",
					n: 41
				},
				{
					s: "Warning",
					n: 3
				},
				{
					s: "Critical",
					n: 0
				},
				{
					s: "Maintenance",
					n: 1
				},
				{
					s: "Offline",
					n: 0
				}
			].map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center justify-content-between mb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "x-small",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: h.s
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-grow-1 mx-3",
						style: {
							height: 6,
							borderRadius: 4,
							background: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
							overflow: "hidden"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
							width: `${h.n / 45 * 100}%`,
							height: "100%",
							background: h.s === "Healthy" ? PALETTE.success : h.s === "Warning" ? PALETTE.warning : h.s === "Critical" ? PALETTE.danger : PALETTE.info
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "x-small fw-bold",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: h.n
					})
				]
			}, i))]
		})
	] });
	const renderAiGov = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			icon: faRobot,
			title: "AI Governance",
			color: PALETTE.purple,
			isDark,
			desc: "Models, usage, permissions, sensitive data"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3 mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faBrain,
						label: "AI Requests",
						value: "128K",
						trend: "+21%",
						color: PALETTE.purple,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faKey,
						label: "AI Credits Left",
						value: "42K",
						color: PALETTE.info,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faUserSecret,
						label: "Sensitive Detected",
						value: "6",
						color: PALETTE.warning,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faCircleCheck,
						label: "Human Approved",
						value: "98%",
						color: PALETTE.success,
						isDark
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fw-bold mb-2",
					style: { color: isDark ? "#e2e8f0" : "#1e293b" },
					children: "AI Models"
				}), [
					"GPT-4o",
					"Claude 3.5",
					"Gemini Pro",
					"Llama 3",
					"DeepSeek"
				].map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "x-small",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: m
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
						status: i < 4 ? "Active" : "Pending",
						isDark
					})]
				}, i))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fw-bold mb-2",
					style: { color: isDark ? "#e2e8f0" : "#1e293b" },
					children: "Controls"
				}), [
					"Prompt Filtering",
					"Output Review",
					"Human Approval",
					"Sensitive Data Detection",
					"Credit Quotas"
				].map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "x-small",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: m
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
						status: "Active",
						isDark
					})]
				}, i))]
			})]
		})
	] });
	const renderBackup = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			icon: faDatabase,
			title: "Backup & Disaster Recovery",
			color: PALETTE.warning,
			isDark,
			desc: "Automated, incremental & cross-region backups"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3 mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faCloudArrowUp,
						label: "Last Backup",
						value: "12m ago",
						color: PALETTE.success,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faRotateLeft,
						label: "Recovery Tests",
						value: "Passed",
						color: PALETTE.info,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faGlobe,
						label: "Regions",
						value: "3",
						color: PALETTE.primary,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faClock,
						label: "RPO",
						value: "5 min",
						color: PALETTE.warning,
						isDark
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fw-bold mb-2",
					style: { color: isDark ? "#e2e8f0" : "#1e293b" },
					children: "Backup Types"
				}), [
					"Incremental",
					"Full",
					"Manual",
					"Scheduled",
					"Cloud",
					"Local",
					"Cross-Region",
					"Point-in-Time"
				].map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "x-small",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: b
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
						status: i < 7 ? "Active" : "Pending",
						isDark
					})]
				}, i))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fw-bold mb-2",
					style: { color: isDark ? "#e2e8f0" : "#1e293b" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faRotateLeft,
						className: "me-2",
						style: { color: PALETTE.info }
					}), "Recent Recoveries"]
				}), [
					{
						t: "Workspace restored",
						who: "nat@wayne.com",
						time: "2h ago"
					},
					{
						t: "Version restored",
						who: "tony@stark.io",
						time: "1d ago"
					},
					{
						t: "Asset library restored",
						who: "system",
						time: "3d ago"
					}
				].map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center justify-content-between mb-2 pb-2",
					style: { borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#eef2f7"}` },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "x-small fw-bold",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: r.t
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "x-small text-muted",
						children: r.who
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "x-small text-muted",
						children: r.time
					})]
				}, i))]
			})]
		})
	] });
	const renderAnalytics = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			icon: faChartLine,
			title: "Analytics & Business Intelligence",
			color: PALETTE.info,
			isDark,
			desc: "Usage, revenue, feature adoption & AI analytics"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3 mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faUsers,
						label: "Active Companies",
						value: "1,284",
						trend: "+3.1%",
						color: PALETTE.primary,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faPalette,
						label: "Total Drawings",
						value: "942K",
						trend: "+11%",
						color: PALETTE.purple,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faTv,
						label: "Presentations",
						value: "61K",
						trend: "+9%",
						color: PALETTE.warning,
						isDark
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: faChartPie,
						label: "Revenue",
						value: "$858K",
						trend: "+14%",
						color: PALETTE.success,
						isDark
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fw-bold mb-2",
					style: { color: isDark ? "#e2e8f0" : "#1e293b" },
					children: "Feature Adoption"
				}), [
					{
						f: "Real-time Collaboration",
						p: 78
					},
					{
						f: "AI Assistant",
						p: 64
					},
					{
						f: "Presentations",
						p: 52
					},
					{
						f: "Plugins",
						p: 21
					},
					{
						f: "MCP Integration",
						p: 12
					}
				].map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between x-small",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.f }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.p, "%"] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							height: 6,
							borderRadius: 4,
							background: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
							overflow: "hidden"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
							width: `${a.p}%`,
							height: "100%",
							background: PALETTE.primary
						} })
					})]
				}, i))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-md-6",
				style: cardStyle(isDark),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fw-bold mb-2",
					style: { color: isDark ? "#e2e8f0" : "#1e293b" },
					children: "Reports"
				}), [
					"Usage Report",
					"Security Report",
					"Compliance Report",
					"Revenue Report",
					"Subscription Report",
					"Storage Report"
				].map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-sm rounded-pill me-2 mb-2",
					style: {
						background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
						color: isDark ? "#e2e8f0" : "#1e293b",
						border: "none",
						fontSize: 11
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faFileInvoiceDollar,
						className: "me-1"
					}), r]
				}, i))]
			})]
		})
	] });
	const renderAudit = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		icon: faHistory,
		title: "Audit Logs",
		color: PALETTE.primary,
		isDark,
		desc: "Immutable activity trail across the platform"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: cardStyle(isDark),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "table-responsive",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "table align-middle mb-0",
				style: { fontSize: 13 },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-uppercase",
					style: {
						fontSize: 10,
						letterSpacing: "0.05em",
						color: "#94a3b8"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "User" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Action" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Detail" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "IP" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Timestamp" })
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: auditLogs.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "fw-semibold",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: l.user
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: l.action }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-muted",
						children: l.detail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-muted",
						children: l.ip
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-muted",
						children: l.time
					})
				] }, i)) })]
			})
		})
	})] });
	const renderNotifications = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		icon: faBell,
		title: "Notification Center",
		color: PALETTE.warning,
		isDark,
		desc: "Channels & routing for enterprise alerts"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "row g-3",
		children: [
			{
				c: "Email",
				i: faEnvelope ?? faBell,
				s: "Active"
			},
			{
				c: "SMS",
				i: faCommentDots ?? faBell,
				s: "Active"
			},
			{
				c: "Push Notification",
				i: faBell,
				s: "Active"
			},
			{
				c: "Slack",
				i: faSlack ?? faBell,
				s: "Pending"
			},
			{
				c: "Microsoft Teams",
				i: faUsers,
				s: "Pending"
			},
			{
				c: "Webhook",
				i: faWifi,
				s: "Active"
			}
		].map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "col-md-4",
			style: cardStyle(isDark),
			className: "d-flex align-items-center justify-content-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: n.i,
					style: { color: PALETTE.info }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "fw-bold",
					style: { color: isDark ? "#e2e8f0" : "#1e293b" },
					children: n.c
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				status: n.s,
				isDark
			})]
		}, i))
	})] });
	const renderFlags = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		icon: faFlag,
		title: "Feature Flags",
		color: PALETTE.purple,
		isDark,
		desc: "Enable, disable & roll out features"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: cardStyle(isDark),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "row g-3",
			children: Object.entries(featureFlags).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-md-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center justify-content-between p-3 rounded-3",
					style: { background: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "x-small fw-bold text-capitalize",
						style: { color: isDark ? "#e2e8f0" : "#1e293b" },
						children: k.replace(/([A-Z])/g, " $1")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "form-check form-switch m-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "form-check-input",
							type: "checkbox",
							checked: v,
							onChange: () => toggleFlag(k)
						})
					})]
				})
			}, k))
		})
	})] });
	const renderTools = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		icon: faGear,
		title: "Super Admin Tools",
		color: PALETTE.primary,
		isDark,
		desc: "Global operations & emergency controls"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "row g-3",
		children: [
			{
				t: "Global Search",
				i: faMagnifyingGlass,
				c: PALETTE.info
			},
			{
				t: "Impersonate User",
				i: faUserSecret,
				c: PALETTE.warning
			},
			{
				t: "Emergency Maintenance",
				i: faTriangleExclamation,
				c: PALETTE.danger
			},
			{
				t: "Broadcast Message",
				i: faBell,
				c: PALETTE.primary
			},
			{
				t: "System Lockdown",
				i: faLock,
				c: PALETTE.danger
			},
			{
				t: "Force Logout All",
				i: faUsers,
				c: PALETTE.warning
			},
			{
				t: "Cache Management",
				i: faLayerGroup,
				c: PALETTE.purple
			},
			{
				t: "Queue Management",
				i: faListCheck,
				c: PALETTE.info
			},
			{
				t: "Migration Manager",
				i: faCloudArrowUp,
				c: PALETTE.success
			}
		].map((tl, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-md-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn w-100 rounded-4 p-3 d-flex align-items-center gap-2",
				style: {
					background: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
					color: isDark ? "#e2e8f0" : "#1e293b",
					border: "none",
					justifyContent: "flex-start"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: tl.i,
					style: { color: tl.c }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "fw-bold x-small",
					children: tl.t
				})]
			})
		}, i))
	})] });
	const RENDERERS = {
		overview: renderOverview,
		companies: renderCompanies,
		licensing: renderLicensing,
		security: renderSecurity,
		compliance: renderCompliance,
		monitoring: renderMonitoring,
		aigovernance: renderAiGov,
		backup: renderBackup,
		analytics: renderAnalytics,
		audit: renderAudit,
		notifications: renderNotifications,
		featureflags: renderFlags,
		tools: renderTools
	};
	const filteredRows = ROWS.filter((r) => r.label.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		style: { padding: "8px 4px" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-lg-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: cardStyle(isDark),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "position-relative mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faMagnifyingGlass,
							className: "position-absolute text-muted",
							style: {
								left: 10,
								top: 9,
								fontSize: 11
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "form-control form-control-sm rounded-pill ps-4",
							placeholder: "Search admin...",
							style: inputStyle(isDark),
							value: search,
							onChange: (e) => setSearch(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex flex-column gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "x-small fw-bold text-uppercase text-muted mb-1",
							style: { letterSpacing: "0.06em" },
							children: "Administration"
						}), filteredRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActive(r.id),
							className: "nav-btn d-flex align-items-center gap-2 px-3 py-2 border-0",
							style: {
								borderRadius: 10,
								fontSize: "0.8rem",
								transition: "all 0.2s",
								color: active === r.id ? "#fff" : isDark ? "#cbd5e1" : "#475569",
								background: active === r.id ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "transparent",
								boxShadow: active === r.id ? "0 4px 16px rgba(99,102,241,0.3)" : "none"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: r.icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.label })]
						}, r.id))]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-lg-9",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					mode: "wait",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: { opacity: 0 },
						transition: { duration: .25 },
						children: RENDERERS[active]?.()
					}, active)
				})
			})]
		})
	});
};
//#endregion
export { DrawingEnterpriseAdmin as default };
