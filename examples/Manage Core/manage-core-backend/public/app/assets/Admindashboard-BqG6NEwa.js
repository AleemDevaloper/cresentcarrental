import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { n as SiGooglechrome, r as SiSlack, t as SiFigma } from "./vendor-DP0tj0ry.js";
import { $l as plugin_legend, $t as faCheckCircle, Br as faFileExport, Cn as faClock, Dl as require_jsx_runtime, Dn as faCloud, Do as faPlus, Fc as faUpload, G as faArrowUp, Hl as LineElement, Il as BarElement, Jl as RadialLinearScale, Jt as faChartBar, Kl as PointElement, Mn as faCode, Nt as faCalendarAlt, Pl as ArcElement, Qa as faNetworkWired, Qc as faUserTag, Rl as CategoryScale, Sr as faExclamationCircle, Tr as faExternalLinkAlt, Ul as LinearScale, Vn as faCommentDots, Xn as faCubes, Yt as faChartLine, Za as faMusic, Zl as index, Zn as faDatabase, _r as faEnvelope, ba as faLock, bl as useApp, bs as faShoppingCart, bt as faBriefcase, da as faLayerGroup, f as Bar, fr as faEdit, g as Radar, gs as faShieldHalved, in as faChevronRight, lo as faPenToSquare, lt as faBolt, m as Line, mr as faEllipsisH, on as faCircle, os as faSearch, p as Doughnut, pi as faGamepad, ru as require_react, sl as faVideo, ti as faFilter, tl as faUsers, to as faPaintBrush, tu as plugin_tooltip, uc as faTimes, vc as faTrashAlt, vl as FontAwesomeIcon, xi as faGlobe, zl as Chart, zt as faCamera } from "./ai-BHgPkVLC.js";
import { P as listUsers, Wt as useNavigate } from "./superadmin-Cn5Mt1aQ.js";
import { K as TmsRightSidePanel, ft as listAllTasks, ut as getTmsWorkHeatmap } from "./tms-BZu3d1fQ.js";
//#region src/pages/AdminDashboard/Admindashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var APP_ICON_OPTIONS = {
	globe: faGlobe,
	envelope: faEnvelope,
	code: faCode,
	music: faMusic,
	camera: faCamera,
	cart: faShoppingCart,
	cloud: faCloud,
	gamepad: faGamepad,
	video: faVideo,
	chat: faCommentDots,
	brush: faPaintBrush,
	chart: faChartBar,
	pen: faPenToSquare
};
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, ArcElement, index, plugin_tooltip, plugin_legend);
var StatCard = ({ title, value, subValue, icon, color, progress, trendData, isDark }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: `card border-0 shadow-sm h-100 overflow-hidden transition-all hover-lift ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
	style: {
		borderRadius: "24px",
		border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)"
	},
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-body p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `rounded-4 d-flex align-items-center justify-content-center shadow-sm`,
					style: {
						width: "52px",
						height: "52px",
						background: `rgba(var(--bs-${color}-rgb), 0.1)`,
						color: `var(--bs-${color})`
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon,
						className: "fs-4"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `badge bg-${color}-subtle text-${color} rounded-pill px-2 py-1 small fw-bold`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faChartLine,
							className: "me-1"
						}), " +12%"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row align-items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: `fw-black mb-1 ls-tight ${isDark ? "text-white" : "text-dark"}`,
						children: value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted small fw-bold text-uppercase mb-0",
						style: {
							letterSpacing: "0.05em",
							opacity: .7
						},
						children: title
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							height: "50px",
							width: "100%"
						},
						children: trendData && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							id: `sparkline-${title.replace(/\s+/g, "-").toLowerCase()}`,
							data: {
								labels: [
									"",
									"",
									"",
									"",
									"",
									"",
									""
								],
								datasets: [{
									data: trendData,
									borderColor: color === "primary" ? "#4F46E5" : color === "success" ? "#10B981" : color === "warning" ? "#F59E0B" : "#06B6D4",
									borderWidth: 2.5,
									pointRadius: 0,
									pointHoverRadius: 5,
									pointHoverBackgroundColor: "#fff",
									pointHoverBorderColor: color === "primary" ? "#4F46E5" : color === "success" ? "#10B981" : color === "warning" ? "#F59E0B" : "#06B6D4",
									pointHoverBorderWidth: 2,
									tension: .45,
									fill: true,
									backgroundColor: (context) => {
										const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 50);
										const rgb = color === "primary" ? "79, 70, 229" : color === "success" ? "16, 185, 129" : color === "warning" ? "245, 158, 11" : "6, 182, 212";
										gradient.addColorStop(0, `rgba(${rgb}, 0.15)`);
										gradient.addColorStop(1, `rgba(${rgb}, 0)`);
										return gradient;
									}
								}]
							},
							options: {
								plugins: {
									legend: { display: false },
									tooltip: { enabled: false }
								},
								scales: {
									x: { display: false },
									y: { display: false }
								},
								maintainAspectRatio: false,
								responsive: true
							}
						})
					})
				})]
			}),
			progress !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
						className: "text-muted fw-bold",
						style: { fontSize: "0.7rem" },
						children: subValue
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
						className: `fw-black ${isDark ? "text-white" : "text-dark"}`,
						style: { fontSize: "0.7rem" },
						children: [progress, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `progress overflow-visible`,
					style: {
						height: "6px",
						borderRadius: "10px",
						background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `progress-bar bg-${color} rounded-pill shadow-sm position-relative`,
						style: { width: `${progress}%` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "position-absolute end-0 top-50 translate-middle-y rounded-circle bg-white shadow-sm border border-2 border-primary",
							style: {
								width: "12px",
								height: "12px",
								borderColor: `var(--bs-${color}) !important`
							}
						})
					})
				})]
			})
		]
	})
});
var ShortcutButton = ({ label, icon, color, onClick, description, isDark }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: `card border-0 shadow-sm transition-all hover-lift-lg cursor-pointer h-100 overflow-hidden group ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
	style: {
		borderRadius: "24px",
		border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
		position: "relative"
	},
	onClick,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-body p-4 position-relative z-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `rounded-4 d-flex align-items-center justify-content-center mb-4 shadow-sm transition-all group-hover-bounce`,
				style: {
					width: "64px",
					height: "64px",
					background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
					color: `var(--bs-${color})`
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon,
					className: "fs-3"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
				className: `fw-bold mb-2 ${isDark ? "text-white" : "text-dark"}`,
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted small mb-4 line-clamp-2",
				style: {
					fontSize: "0.82rem",
					height: "2.5rem"
				},
				children: description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `d-flex align-items-center justify-content-between text-${color} fw-bold small mt-auto`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Manage Module" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faChevronRight,
					className: "small group-hover-translate-x transition-all"
				})]
			})
		]
	})
});
var AdminDashboardPage = () => {
	const { themeStyle, theme, currentUser, setActiveTab, addNotification } = useApp();
	useNavigate();
	const isDark = theme === "dark";
	const themeClass = themeStyle === "glassmorphism" ? "glass-theme" : "";
	const [tooltip, setTooltip] = (0, import_react.useState)({
		show: false,
		day: "",
		hour: "",
		tasks: 0,
		hours: 0,
		x: 0,
		y: 0
	});
	const [workHours, setWorkHours] = (0, import_react.useState)([
		"9 AM",
		"10 AM",
		"11 AM",
		"12 PM",
		"1 PM",
		"2 PM",
		"3 PM",
		"4 PM"
	]);
	const [workDays, setWorkDays] = (0, import_react.useState)([
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	]);
	const [heatmapData, setHeatmapData] = (0, import_react.useState)([]);
	const [analyticsSummary, setAnalyticsSummary] = (0, import_react.useState)({
		bestDay: "-",
		bestHour: "-",
		weeklyScore: 0,
		totalHours: 0,
		avgDaily: 0
	});
	const [heatmapLoading, setHeatmapLoading] = (0, import_react.useState)(true);
	const [appUsage, setAppUsage] = (0, import_react.useState)([
		{
			id: 1,
			name: "Figma",
			category: "Design",
			url: "https://figma.com",
			time: "36h 40m",
			hours: 36.67,
			minutes: 2200,
			progress: 85,
			color: "#10B981",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiFigma, {})
		},
		{
			id: 2,
			name: "Google Chrome",
			category: "Browser",
			url: "https://google.com",
			time: "24h 40m",
			hours: 24.67,
			minutes: 1480,
			progress: 65,
			color: "#7c3aed",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiGooglechrome, {})
		},
		{
			id: 3,
			name: "Slack",
			category: "Communication",
			url: "https://slack.com",
			time: "15h 20m",
			hours: 15.33,
			minutes: 920,
			progress: 40,
			color: "#3B82F6",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiSlack, {})
		}
	]);
	const renderAppIcon = (app) => {
		if (app.iconUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: app.iconUrl,
			alt: app.name,
			style: {
				width: "1.4rem",
				height: "1.4rem",
				objectFit: "contain",
				borderRadius: "6px"
			}
		});
		if (app.iconFa && APP_ICON_OPTIONS[app.iconFa]) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: APP_ICON_OPTIONS[app.iconFa] });
		if (app.icon) return app.icon;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			style: {
				fontWeight: 800,
				fontSize: "0.9rem"
			},
			children: app.name.charAt(0).toUpperCase()
		});
	};
	const [showAppModal, setShowAppModal] = (0, import_react.useState)(false);
	const [editingApp, setEditingApp] = (0, import_react.useState)(null);
	const [appForm, setAppForm] = (0, import_react.useState)({
		name: "",
		category: "",
		url: "",
		hours: "",
		minutes: "",
		progress: 50,
		color: "#4F46E5",
		iconUrl: null,
		iconFa: null
	});
	const openAddApp = () => {
		setEditingApp(null);
		setAppForm({
			name: "",
			category: "",
			url: "",
			hours: "",
			minutes: "",
			progress: 50,
			color: "#4F46E5",
			iconUrl: null,
			iconFa: null
		});
		setShowAppModal(true);
	};
	const openEditApp = (app) => {
		setEditingApp(app);
		setAppForm({
			name: app.name,
			category: app.category,
			url: app.url || "",
			hours: app.hours ? String(Math.floor(app.hours)) : "",
			minutes: app.minutes ? String(app.minutes % 60) : "",
			progress: app.progress,
			color: app.color,
			iconUrl: app.iconUrl || null,
			iconFa: app.iconFa || null
		});
		setShowAppModal(true);
	};
	const handleAppIconUpload = (e) => {
		const file = e.target.files && e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			setAppForm((prev) => ({
				...prev,
				iconUrl: reader.result,
				iconFa: null
			}));
		};
		reader.readAsDataURL(file);
	};
	const saveApp = () => {
		if (!appForm.name.trim()) {
			addNotification("Please enter an app name.", "warning");
			return;
		}
		const h = parseFloat(appForm.hours) || 0;
		const m = parseFloat(appForm.minutes) || 0;
		const totalMinutes = Math.round(h * 60 + m);
		const hoursVal = totalMinutes / 60;
		const timeStr = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
		const progress = Math.max(0, Math.min(100, parseInt(appForm.progress, 10) || 0));
		if (editingApp) {
			setAppUsage((prev) => prev.map((a) => a.id === editingApp.id ? {
				...a,
				name: appForm.name.trim(),
				category: appForm.category.trim() || "Uncategorized",
				url: appForm.url.trim() || null,
				time: timeStr,
				hours: hoursVal,
				minutes: totalMinutes,
				progress,
				color: appForm.color,
				iconUrl: appForm.iconUrl,
				iconFa: appForm.iconFa
			} : a));
			addNotification(`"${appForm.name}" updated successfully.`, "success");
		} else {
			const newApp = {
				id: Date.now(),
				name: appForm.name.trim(),
				category: appForm.category.trim() || "Uncategorized",
				url: appForm.url.trim() || null,
				time: timeStr,
				hours: hoursVal,
				minutes: totalMinutes,
				progress,
				color: appForm.color,
				iconUrl: appForm.iconUrl,
				iconFa: appForm.iconFa,
				icon: appForm.iconUrl || appForm.iconFa ? void 0 : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						fontWeight: 800,
						fontSize: "0.9rem"
					},
					children: appForm.name.trim().charAt(0).toUpperCase()
				})
			};
			setAppUsage((prev) => [...prev, newApp]);
			addNotification(`"${appForm.name}" added to Top Web Apps.`, "success");
		}
		setShowAppModal(false);
		setEditingApp(null);
	};
	const deleteApp = (id) => {
		setAppUsage((prev) => prev.filter((a) => a.id !== id));
		addNotification("Web app removed.", "info");
	};
	const adminCardsData = [
		{
			title: "Working Hours",
			value: "950h 45m",
			trend: "up",
			trendText: "20% in Last 7 Days",
			color: "primary",
			trendData: [
				30,
				45,
				35,
				60,
				55,
				75,
				85
			],
			icon: faClock
		},
		{
			title: "Production",
			value: "400h 22m",
			trend: "down",
			trendText: "20% in Last 7 Days",
			color: "warning",
			trendData: [
				60,
				50,
				40,
				55,
				45,
				35,
				30
			],
			icon: faBriefcase
		},
		{
			title: "Unproductive",
			value: "50h 25m",
			trend: "up",
			trendText: "45% in Last 7 Days",
			color: "info",
			trendData: [
				10,
				20,
				15,
				30,
				25,
				40,
				50
			],
			icon: faExclamationCircle
		},
		{
			title: "Manual Added",
			value: "46h 45m",
			trend: "up",
			trendText: "22% in Last 7 Days",
			color: "success",
			trendData: [
				5,
				15,
				10,
				20,
				18,
				25,
				30
			],
			icon: faPlus
		}
	];
	const MEMBER_ACCENT_COLORS = [
		"#4F46E5",
		"#EC4899",
		"#F59E0B",
		"#7C3AED",
		"#0EA5E9",
		"#10B981",
		"#EF4444",
		"#06B6D4"
	];
	const [teamMembers, setTeamMembers] = (0, import_react.useState)([]);
	const [teamLoading, setTeamLoading] = (0, import_react.useState)(true);
	const [teamSearch, setTeamSearch] = (0, import_react.useState)("");
	const [showTeamSearch, setShowTeamSearch] = (0, import_react.useState)(false);
	const fetchTeamMembers = async () => {
		try {
			const data = await listUsers();
			setTeamMembers((Array.isArray(data) ? data : []).slice(0, 8).map((u, i) => ({
				id: u.id,
				name: u.name || "Unnamed User",
				position: u.role || "Member",
				experience: u.status === "active" ? "Active" : u.status ? u.status.charAt(0).toUpperCase() + u.status.slice(1) : "Member",
				color: MEMBER_ACCENT_COLORS[i % MEMBER_ACCENT_COLORS.length],
				avatar: u.avatar || `https://i.pravatar.cc/150?u=${u.id}`,
				online: !!u.isOnline
			})));
		} catch (err) {
			console.error("Failed to load team members", err);
			setTeamMembers([]);
		} finally {
			setTeamLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchTeamMembers();
	}, []);
	const filteredTeamMembers = (0, import_react.useMemo)(() => {
		if (!teamSearch.trim()) return teamMembers;
		const q = teamSearch.trim().toLowerCase();
		return teamMembers.filter((m) => m.name.toLowerCase().includes(q) || (m.position || "").toLowerCase().includes(q));
	}, [teamMembers, teamSearch]);
	const saasActivities = [
		{
			title: "Leave Approved",
			desc: "Medical Leave Approved",
			time: "10 mins ago",
			color: "#4F46E5",
			icon: faCheckCircle
		},
		{
			title: "Appraisal Submitted",
			desc: "Performance Review Submitted",
			time: "20 mins ago",
			color: "#F59E0B",
			icon: faFileExport
		},
		{
			title: "Payslip Generated",
			desc: "Payroll Generated",
			time: "25 mins ago",
			color: "#10B981",
			icon: faBolt
		},
		{
			title: "Updated Time Sheet",
			desc: "Timesheet Updated",
			time: "1 hour ago",
			color: "#7c3aed",
			icon: faClock
		},
		{
			title: "Contact Changed",
			desc: "Employee Information Changed",
			time: "5 Aug 2025",
			color: "#EC4899",
			icon: faUserTag
		}
	];
	const productionDoubleRingData = {
		labels: ["Production", "Manual"],
		datasets: [{
			label: "Production Hours",
			data: [265, 83],
			backgroundColor: ["rgba(79, 70, 229, 0.9)", "rgba(79, 70, 229, 0.05)"],
			borderWidth: 0,
			cutout: "80%",
			borderRadius: 20
		}, {
			label: "Manual Hours",
			data: [82, 266],
			backgroundColor: ["rgba(245, 158, 11, 0.9)", "rgba(245, 158, 11, 0.05)"],
			borderWidth: 0,
			cutout: "65%",
			borderRadius: 20
		}]
	};
	const radarData = {
		labels: [
			"Experience",
			"Productivity",
			"Security",
			"Compliance",
			"Quality"
		],
		datasets: [{
			label: "Current Year",
			data: [
				85,
				92,
				78,
				88,
				95
			],
			borderColor: "#4F46E5",
			backgroundColor: "rgba(79, 70, 229, 0.15)",
			pointBackgroundColor: "#4F46E5",
			borderWidth: 2
		}, {
			label: "Previous Year",
			data: [
				75,
				82,
				70,
				80,
				85
			],
			borderColor: "#f59e0b",
			backgroundColor: "rgba(245, 158, 11, 0.15)",
			pointBackgroundColor: "#f59e0b",
			borderWidth: 2
		}]
	};
	const performanceData = {
		labels: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		],
		datasets: [{
			label: "This Year",
			data: [
				60,
				30,
				42,
				65,
				50,
				85,
				45,
				65,
				60,
				75,
				32,
				56
			],
			backgroundColor: "#4F46E5",
			borderRadius: 8,
			barThickness: 14,
			order: 2
		}, {
			label: "Last Year",
			data: [
				45,
				55,
				38,
				48,
				62,
				75,
				52,
				70,
				55,
				68,
				45,
				60
			],
			borderColor: "#f59e0b",
			backgroundColor: "rgba(245, 158, 11, 0.15)",
			fill: true,
			tension: .4,
			borderWidth: 2,
			pointRadius: 0,
			pointHoverRadius: 6,
			pointBackgroundColor: "#f59e0b",
			type: "line",
			order: 1
		}]
	};
	const recentTasks = [
		{
			code: "FS",
			title: "FlowSpark - Workflow tools",
			subtitle: "Inner pages demo",
			duration: "4h 22m",
			status: "Ongoing",
			color: "#fd7e14"
		},
		{
			code: "TZ",
			title: "TaskZen - Productivity",
			subtitle: "Creating Login Pages",
			duration: "2h 33m",
			status: "Completed",
			color: "#198754"
		},
		{
			code: "CP",
			title: "CodePulse - Cloud tools",
			subtitle: "Design a Service Detail Page",
			duration: "4h 33m",
			status: "Completed",
			color: "#0d6efd"
		},
		{
			code: "PD",
			title: "PulseDesk - Helpdesk",
			subtitle: "Creating Admin Dashboard",
			duration: "16h 33m",
			status: "Completed",
			color: "#6f42c1"
		},
		{
			code: "CL",
			title: "Corelytics - Data tools",
			subtitle: "Write Function on Hover",
			duration: "42h 33m",
			status: "Completed",
			color: "#0dcaf0"
		}
	];
	const projectStatsData = {
		labels: [
			"15 Jan",
			"16 Jan",
			"17 Jan",
			"18 Jan",
			"19 Jan",
			"20 Jan",
			"21 Jan"
		],
		datasets: [
			{
				label: "Active",
				data: [
					45,
					52,
					38,
					65,
					48,
					70,
					60
				],
				backgroundColor: "#4F46E5",
				borderRadius: {
					topLeft: 6,
					topRight: 6
				},
				barThickness: 12
			},
			{
				label: "In Progress",
				data: [
					35,
					40,
					25,
					45,
					30,
					55,
					45
				],
				backgroundColor: "#F59E0B",
				borderRadius: {
					topLeft: 6,
					topRight: 6
				},
				barThickness: 12
			},
			{
				label: "Completed",
				data: [
					20,
					30,
					15,
					40,
					25,
					35,
					30
				],
				backgroundColor: "#10B981",
				borderRadius: {
					topLeft: 6,
					topRight: 6
				},
				barThickness: 12
			}
		]
	};
	const recentProjects = [
		{
			id: "TZ",
			name: "TaskZen",
			category: "Productivity",
			tasks: 48,
			budget: "$3500",
			color: "#4F46E5",
			bg: "#eef2ff",
			team: [
				"https://i.pravatar.cc/150?u=1",
				"https://i.pravatar.cc/150?u=2",
				"https://i.pravatar.cc/150?u=3"
			]
		},
		{
			id: "FS",
			name: "FlowSpark",
			category: "Workflow Tools",
			tasks: 32,
			budget: "$8966",
			color: "#7c3aed",
			bg: "#f5f3ff",
			team: ["https://i.pravatar.cc/150?u=4", "https://i.pravatar.cc/150?u=5"]
		},
		{
			id: "CL",
			name: "Corelytics",
			category: "Data Tools",
			tasks: 56,
			budget: "$7896",
			color: "#06b6d4",
			bg: "#ecfeff",
			team: [
				"https://i.pravatar.cc/150?u=6",
				"https://i.pravatar.cc/150?u=7",
				"https://i.pravatar.cc/150?u=8",
				"https://i.pravatar.cc/150?u=9"
			]
		},
		{
			id: "CP",
			name: "CodePulse",
			category: "Cloud Tools",
			tasks: 24,
			budget: "$4500",
			color: "#10b981",
			bg: "#f0fdf4",
			team: ["https://i.pravatar.cc/150?u=10", "https://i.pravatar.cc/150?u=11"]
		},
		{
			id: "PD",
			name: "PulseDesk",
			category: "Helpdesk",
			tasks: 18,
			budget: "$2200",
			color: "#f59e0b",
			bg: "#fffbeb",
			team: ["https://i.pravatar.cc/150?u=12"]
		}
	];
	const [taskDetails, setTaskDetails] = (0, import_react.useState)([]);
	const [taskLoading, setTaskLoading] = (0, import_react.useState)(true);
	const mapTaskStatsStatus = (status) => {
		if (status === "In Progress" || status === "Ongoing") return "Ongoing";
		if (status === "Done" || status === "Completed") return "Completed";
		if (status === "On Hold" || status === "Blocked" || status === "Testing") return "Incomplete";
		return "To Do";
	};
	const taskStatusBreakdown = (() => {
		const counts = {
			Ongoing: 0,
			"To Do": 0,
			Completed: 0,
			Incomplete: 0
		};
		taskDetails.forEach((t) => {
			counts[mapTaskStatsStatus(t.status)] += 1;
		});
		return counts;
	})();
	const taskStatsTotal = taskDetails.length;
	const taskStatsCompletionRate = taskStatsTotal > 0 ? Math.round(taskStatusBreakdown.Completed / taskStatsTotal * 100) : 0;
	const taskStatsRows = [
		{
			label: "Ongoing Tasks",
			value: taskStatusBreakdown.Ongoing,
			color: "#4F46E5"
		},
		{
			label: "To Do Tasks",
			value: taskStatusBreakdown["To Do"],
			color: "#F59E0B"
		},
		{
			label: "Completed Tasks",
			value: taskStatusBreakdown.Completed,
			color: "#10B981"
		},
		{
			label: "Incomplete Tasks",
			value: taskStatusBreakdown.Incomplete,
			color: "#7c3aed"
		}
	];
	const taskStatsData = {
		labels: [
			"Ongoing",
			"To Do",
			"Completed",
			"Incomplete"
		],
		datasets: [{
			data: [
				taskStatusBreakdown.Ongoing,
				taskStatusBreakdown["To Do"],
				taskStatusBreakdown.Completed,
				taskStatusBreakdown.Incomplete
			],
			backgroundColor: (context) => {
				const ctx = context.chart.ctx;
				return [
					["79, 70, 229", "67, 56, 202"],
					["245, 158, 11", "217, 119, 6"],
					["16, 185, 129", "5, 150, 105"],
					["124, 58, 237", "109, 40, 217"]
				].map(([c1, c2]) => {
					const gradient = ctx.createLinearGradient(0, 0, 0, 200);
					gradient.addColorStop(0, `rgba(${c1}, 0.9)`);
					gradient.addColorStop(1, `rgba(${c2}, 1)`);
					return gradient;
				});
			},
			hoverOffset: 12,
			borderWidth: 0,
			borderRadius: 10
		}]
	};
	const TASK_STATUS_COLORS = {
		Ongoing: ["79, 70, 229", "67, 56, 202"],
		"On Hold": ["124, 58, 237", "109, 40, 217"],
		Completed: ["249, 115, 22", "234, 88, 12"]
	};
	const mapTmsStatus = (status) => {
		if (status === "In Progress") return "Ongoing";
		if (status === "Done") return "Completed";
		return "On Hold";
	};
	(0, import_react.useEffect)(() => {
		const fetchTmsTasks = async () => {
			try {
				const data = await listAllTasks(null, { skipAuthRedirect: true });
				setTaskDetails((Array.isArray(data) ? data : []).map((t) => ({
					id: t.id,
					name: t.title || "Untitled Task",
					assignee: t.assignee?.name ? t.assignee.name.trim().split(/\s+/).map((p) => p[0]).join("").toUpperCase().slice(0, 2) : "NA",
					status: mapTmsStatus(t.status),
					progress: t.progress ?? 0
				})));
			} catch (err) {
				console.error("Failed to load TMS tasks", err);
				setTaskDetails([]);
			} finally {
				setTaskLoading(false);
			}
		};
		fetchTmsTasks();
	}, []);
	const taskSummary = {
		Ongoing: taskDetails.filter((t) => t.status === "Ongoing").length,
		"On Hold": taskDetails.filter((t) => t.status === "On Hold").length,
		Completed: taskDetails.filter((t) => t.status === "Completed").length
	};
	const taskTotal = taskDetails.length;
	const taskDetailsData = {
		labels: [
			"Ongoing",
			"On Hold",
			"Completed"
		],
		datasets: [{
			data: [
				taskSummary.Ongoing,
				taskSummary["On Hold"],
				taskSummary.Completed
			],
			backgroundColor: (context) => {
				const ctx = context.chart.ctx;
				return [
					TASK_STATUS_COLORS.Ongoing,
					TASK_STATUS_COLORS["On Hold"],
					TASK_STATUS_COLORS.Completed
				].map(([c1, c2]) => {
					const gradient = ctx.createLinearGradient(0, 0, 0, 260);
					gradient.addColorStop(0, `rgba(${c1}, 0.9)`);
					gradient.addColorStop(1, `rgba(${c2}, 1)`);
					return gradient;
				});
			},
			hoverOffset: 20,
			borderWidth: 0,
			borderRadius: 12
		}]
	};
	const computeExperience = (joiningDate) => {
		if (!joiningDate) return "—";
		const joined = new Date(joiningDate);
		if (isNaN(joined.getTime())) return "—";
		const diffMs = Date.now() - joined.getTime();
		const years = Math.floor(diffMs / (365.25 * 24 * 3600 * 1e3));
		if (years < 1) return `${Math.max(1, Math.floor(diffMs / (30.44 * 24 * 3600 * 1e3)))} mo`;
		return `${years} yr${years > 1 ? "s" : ""}`;
	};
	const [projectTable, setProjectTable] = (0, import_react.useState)([]);
	const [directoryLoading, setDirectoryLoading] = (0, import_react.useState)(true);
	const [directoryPage, setDirectoryPage] = (0, import_react.useState)(1);
	const DIRECTORY_PAGE_SIZE = 8;
	(0, import_react.useEffect)(() => {
		const fetchDirectory = async () => {
			try {
				const data = await listUsers();
				setProjectTable((Array.isArray(data) ? data : []).map((u) => ({
					id: u.id,
					name: u.name || "Unnamed User",
					role: u.role || "Member",
					email: u.email || "—",
					phone: u.phone || (u.empId ? `#${u.empId}` : "—"),
					exp: computeExperience(u.joiningDate),
					location: [u.city, u.country].filter(Boolean).join(", ") || u.organization || "Office",
					status: u.status === "active" ? "Active" : u.status ? u.status.charAt(0).toUpperCase() + u.status.slice(1) : "Active"
				})));
			} catch (err) {
				console.error("Failed to load member directory", err);
				setProjectTable([]);
			} finally {
				setDirectoryLoading(false);
			}
		};
		fetchDirectory();
	}, []);
	const directoryTotalPages = Math.max(1, Math.ceil(projectTable.length / DIRECTORY_PAGE_SIZE));
	const visibleDirectory = projectTable.slice((directoryPage - 1) * DIRECTORY_PAGE_SIZE, directoryPage * DIRECTORY_PAGE_SIZE);
	const members = [
		{
			name: "Leon Baxter",
			role: "Test Lead",
			badge: "Testing",
			salary: "$6595",
			initials: "LB",
			accent: "#4F46E5",
			color: "primary"
		},
		{
			name: "Charles Cline",
			role: "Security Engineer",
			badge: "Cybersecurity",
			salary: "$5145",
			initials: "CC",
			accent: "#7c3aed",
			color: "secondary"
		},
		{
			name: "James Higham",
			role: "Android Developer",
			badge: "Mobile App",
			salary: "$7478",
			initials: "JH",
			accent: "#06b6d4",
			color: "info"
		},
		{
			name: "Thomas Ward",
			role: "UI Designer",
			badge: "Design",
			salary: "$4589",
			initials: "TW",
			accent: "#f59e0b",
			color: "warning"
		},
		{
			name: "Aliza Duncan",
			role: "Backend Developer",
			badge: "Customer Service",
			salary: "$6987",
			initials: "AD",
			accent: "#10b981",
			color: "success"
		}
	];
	const approvals = [
		{
			name: "Jonathan King",
			time: "01:00 PM - 01:20 PM",
			initials: "JK",
			color: "primary",
			accent: "#4F46E5"
		},
		{
			name: "Peter Brooks",
			time: "12:20 PM - 01:10 PM",
			initials: "PB",
			color: "info",
			accent: "#06b6d4"
		},
		{
			name: "Cindy Mateo",
			time: "11:40 AM - 12:30 PM",
			initials: "CM",
			color: "warning",
			accent: "#f59e0b"
		},
		{
			name: "Thomas Walsh",
			time: "10:20 AM - 11:00 AM",
			initials: "TW",
			color: "secondary",
			accent: "#7c3aed"
		},
		{
			name: "Eliz Hiltner",
			time: "09:10 AM - 10:00 AM",
			initials: "EH",
			color: "success",
			accent: "#10b981"
		}
	];
	const recentActivities = [
		{
			id: 1,
			user: "Admin",
			action: "System Security Patch v4.2 applied",
			time: "2 mins ago",
			type: "security",
			icon: faShieldHalved,
			color: "danger"
		},
		{
			id: 2,
			user: "HR Manager",
			action: "Modified personnel access levels",
			time: "15 mins ago",
			type: "access",
			icon: faUserTag,
			color: "primary"
		},
		{
			id: 3,
			user: "CloudNode",
			action: "Daily automated backup successful",
			time: "1 hour ago",
			type: "system",
			icon: faDatabase,
			color: "success"
		},
		{
			id: 4,
			user: "Finance Bot",
			action: "Quarterly compliance check completed",
			time: "3 hours ago",
			type: "finance",
			icon: faBolt,
			color: "warning"
		}
	];
	const STATUS_PRIORITY = {
		"In Progress": "high",
		"In Review": "medium",
		"Done": "low",
		"On Hold": "low",
		"Blocked": "high",
		"Testing": "medium"
	};
	const [detailedRecentTasks, setDetailedRecentTasks] = (0, import_react.useState)([]);
	const [taskFilter, setTaskFilter] = (0, import_react.useState)("All");
	const taskFilterOptions = [
		"All",
		"Ongoing",
		"Completed",
		"Review",
		"Pending",
		"Overdue"
	];
	(0, import_react.useEffect)(() => {
		const fetchDetailedTasks = async () => {
			try {
				const data = await listAllTasks(null, { skipAuthRedirect: true });
				setDetailedRecentTasks((Array.isArray(data) ? data : []).map((t) => {
					mapTmsStatus(t.status);
					const initials = (t.title || "TK").split(/\s+/).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("") || "TK";
					const progress = t.progress ?? 0;
					const assigneeName = t.assignee?.name ? t.assignee.name.trim().split(/\s+/).map((p) => p[0]).join("").toUpperCase().slice(0, 2) : null;
					return {
						id: t.id,
						code: initials,
						initials,
						projectName: t.title || "Untitled Task",
						description: t.project?.name || t.category || "No project",
						estimatedTime: progress === 100 ? "Done" : `${progress}%`,
						status: t.status === "In Progress" ? "Ongoing" : t.status === "Done" ? "Completed" : t.status === "In Review" ? "Review" : t.status === "On Hold" || t.status === "Blocked" ? "Pending" : t.status === "Testing" ? "Review" : t.due_date && new Date(t.due_date) < /* @__PURE__ */ new Date() && progress < 100 ? "Overdue" : "Pending",
						color: t.status === "Done" ? "#10B981" : t.status === "In Progress" ? "#fd7e14" : t.status === "In Review" || t.status === "Testing" ? "#0d6efd" : "#6f42c1",
						priority: STATUS_PRIORITY[t.status] || "medium",
						assignee: assigneeName ? `https://i.pravatar.cc/150?u=${encodeURIComponent(assigneeName)}` : "https://i.pravatar.cc/150?u=na",
						dueDate: t.due_date ? new Date(t.due_date).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric"
						}) : "—",
						progress
					};
				}));
			} catch (err) {
				console.error("Failed to load detailed tasks", err);
				setDetailedRecentTasks([]);
			}
		};
		fetchDetailedTasks();
	}, []);
	const visibleTasks = (0, import_react.useMemo)(() => {
		if (taskFilter === "All") return detailedRecentTasks;
		return detailedRecentTasks.filter((t) => t.status === taskFilter);
	}, [detailedRecentTasks, taskFilter]);
	const fetchWorkHeatmap = async () => {
		try {
			const data = await getTmsWorkHeatmap({}, { skipAuthRedirect: true });
			if (data && Array.isArray(data.days) && Array.isArray(data.hours)) {
				setWorkDays(data.days);
				setWorkHours(data.hours.map((h) => {
					const period = h < 12 ? "AM" : "PM";
					return `${h % 12 === 0 ? 12 : h % 12} ${period}`;
				}));
				const grid = data.grid || {};
				setHeatmapData(data.days.map((_, di) => data.hours.map((h) => grid[di]?.[h] || {
					tasks: 0,
					hours: 0
				})));
				if (data.summary) setAnalyticsSummary(data.summary);
			}
		} catch (err) {
			console.error("Failed to load work heatmap", err);
		} finally {
			setHeatmapLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchWorkHeatmap();
	}, []);
	const renderDays = workDays;
	const renderHours = workHours;
	const maxCellHours = heatmapData.reduce((max, row) => row.reduce((m, c) => Math.max(m, c.hours), max), 0);
	const cellLevel = (cellHours) => {
		if (!cellHours || maxCellHours === 0) return 0;
		const ratio = cellHours / maxCellHours;
		if (ratio <= 0) return 0;
		if (ratio <= .25) return 1;
		if (ratio <= .5) return 2;
		if (ratio <= .75) return 3;
		return 4;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `admin-dashboard container-fluid px-0 py-0 ${themeClass} ${isDark ? "dark-mode" : ""}`,
		style: { background: "transparent" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "position-relative mb-5",
				style: { minHeight: "440px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `card border-0 rounded-5 overflow-hidden shadow-2xl h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
					style: { border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "position-absolute top-0 start-0 w-100 h-100 z-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "position-absolute top-0 end-0 opacity-20 blur-4xl animated-blob",
								style: {
									width: "800px",
									height: "800px",
									borderRadius: "50%",
									background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
									transform: "translate(20%, -30%)"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "position-absolute bottom-0 start-0 opacity-15 blur-4xl animated-blob animation-delay-2000",
								style: {
									width: "600px",
									height: "600px",
									borderRadius: "50%",
									background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
									transform: "translate(-10%, 20%)"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "position-absolute top-50 start-50 opacity-10 blur-3xl animated-blob animation-delay-4000",
								style: {
									width: "500px",
									height: "500px",
									borderRadius: "50%",
									background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
									transform: "translate(-50%, -50%)"
								}
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-body p-0 position-relative z-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-0 h-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-xl-7 col-lg-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-5 p-lg-5 h-100 d-flex flex-column justify-content-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-3 mb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-4 bg-primary d-flex align-items-center justify-content-center shadow-lg hover-scale transition-all p-3",
												style: { background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faLayerGroup,
													className: "text-white fs-4"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `badge ${isDark ? "bg-white bg-opacity-10 text-white" : "bg-primary bg-opacity-10 text-primary"} rounded-pill px-3 py-2 fw-black small text-uppercase letter-spacing-wider border ${isDark ? "border-white border-opacity-10" : "border-primary border-opacity-10"} backdrop-blur-md`,
												children: "Admin Command Node v4.2"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `x-small ${isDark ? "text-white-50" : "text-muted"} mt-1 fw-bold`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faShieldHalved,
													className: "me-1 text-success"
												}), " Global Infrastructure Authorization Active"]
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
											className: `display-3 fw-black mb-3 ls-tight ${isDark ? "text-white" : "text-dark"}`,
											style: { letterSpacing: "-0.04em" },
											children: ["Welcome, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gradient-primary",
												children: currentUser?.name || "Administrator"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `lead ${isDark ? "text-white-50" : "text-muted"} mb-5 opacity-80 pe-xl-5 fw-medium`,
											style: { lineHeight: "1.6" },
											children: "Oversee the ManageCore ecosystem. Monitor real-time performance clusters, governance compliance, and user engagement across all integrated enterprise modules."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex flex-wrap gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "btn btn-primary rounded-pill px-5 py-3 fw-black shadow-2xl border-0 hover-lift-lg transition-all d-flex align-items-center gap-3",
												style: { background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)" },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faBolt,
													className: "animate-pulse"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Execute System Audit" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: `btn rounded-pill px-5 py-3 fw-bold transition-all shadow-xl backdrop-blur-md border ${isDark ? "bg-white bg-opacity-5 text-white border-white border-opacity-10 hover-bg-opacity-10" : "bg-white text-dark border-dark border-opacity-10 hover-bg-light"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faUsers,
													className: `me-2 ${isDark ? "text-white" : "text-primary"}`
												}), "User Management"]
											})]
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-xl-5 col-lg-4 d-none d-lg-block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-4 p-xl-5 h-100 d-flex align-items-center justify-content-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 p-xl-5 rounded-5 backdrop-blur-xl border border-white border-opacity-10 shadow-3xl text-white w-100 transition hover-lift position-relative overflow-hidden",
										style: { background: "rgba(15, 23, 42, 0.75)" },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "position-absolute top-0 end-0 p-4 opacity-5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faNetworkWired,
													style: { fontSize: "12rem" }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex justify-content-between align-items-center mb-5 position-relative z-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
													className: "fw-black mb-0",
													children: "Engine Metrics"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
													className: "text-white-50",
													children: "Global Cluster Performance"
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-2 bg-success bg-opacity-25 border border-success text-success px-3 py-1 rounded-pill small fw-bold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pulse-dot bg-success bg-opacity-10" }), " STABLE"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-6 position-relative z-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mb-4",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex justify-content-between mb-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "small fw-bold text-white-50",
																children: "System Load Average"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "small fw-black text-info",
																children: "12.4%"
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "progress rounded-pill shadow-inner overflow-visible",
															style: {
																height: "8px",
																background: "rgba(255,255,255,0.08)"
															},
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "progress-bar progress-bar-striped progress-bar-animated bg-info rounded-pill",
																style: { width: "12.4%" }
															})
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "row g-3 mb-4",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "col-6",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-50",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "text-white-50 x-small fw-bold mb-1",
																	children: "LATENCY"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "h4 mb-0 fw-black",
																	children: "24ms"
																})]
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "col-6",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-50",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "text-white-50 x-small fw-bold mb-1",
																	children: "UPTIME"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "h4 mb-0 fw-black",
																	children: "99.9%"
																})]
															})
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn btn-outline-light btn-sm rounded-pill w-100 fw-bold border-opacity-25 hover-bg-white hover-text-dark py-2",
														children: "Infrastructure Diagnostics"
													})
												]
											})
										]
									})
								})
							})]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4 mt-2",
				children: adminCardsData.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-sm-6 col-xl-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: card.title,
						value: card.value,
						subValue: card.trendText,
						icon: card.icon,
						color: card.color,
						progress: card.trend === "up" ? 68 : 52,
						trendData: card.trendData,
						isDark
					})
				}, card.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-9",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-column gap-5 p-2 ps-0 pt-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-xl-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
											style: { borderRadius: "16px" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "card-body p-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "d-flex justify-content-between align-items-center mb-4",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
															className: `fw-semibold mb-0 ${isDark ? "text-white" : "text-dark"}`,
															children: ["Task Details ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "x-small fw-bold text-muted",
																children: "· TMS"
															})]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "position-relative d-flex justify-content-center align-items-center mb-5",
														style: { minHeight: "280px" },
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															style: {
																width: "300px",
																height: "300px"
															},
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
																id: "task-details-donut",
																data: taskDetailsData,
																options: {
																	responsive: true,
																	maintainAspectRatio: false,
																	cutout: "82%",
																	plugins: { legend: { display: false } }
																}
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "position-absolute text-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-muted small fw-medium mb-1",
																children: "Total Tasks"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: `display-5 fw-bold ${isDark ? "text-white" : "text-dark"}`,
																children: taskTotal
															})]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "row g-0 border-top mt-4 pt-4 text-center",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "col-4 border-end",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "text-muted small mb-1",
																	children: "Ongoing"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: `h4 mb-0 fw-bold ${isDark ? "text-white" : "text-dark"}`,
																	children: taskSummary.Ongoing
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "col-4 border-end",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "text-muted small mb-1",
																	children: "On Hold"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: `h4 mb-0 fw-bold ${isDark ? "text-white" : "text-dark"}`,
																	children: taskSummary["On Hold"]
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "col-4",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "text-muted small mb-1",
																	children: "Completed"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: `h4 mb-0 fw-bold ${isDark ? "text-white" : "text-dark"}`,
																	children: taskSummary.Completed
																})]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-3 d-flex flex-column gap-2",
														style: {
															maxHeight: "220px",
															overflowY: "auto"
														},
														children: [
															taskLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-center text-muted py-3",
																style: { fontSize: "13px" },
																children: "Loading TMS tasks…"
															}),
															!taskLoading && taskDetails.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-center text-muted py-3",
																style: { fontSize: "13px" },
																children: "No TMS tasks found."
															}),
															!taskLoading && taskDetails.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: `d-flex align-items-center justify-content-between p-2 rounded-3 ${isDark ? "hover-bg-white hover-bg-opacity-5" : "hover-bg-light"}`,
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "d-flex align-items-center gap-2",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "rounded-circle d-flex align-items-center justify-content-center fw-bold text-white",
																		style: {
																			width: 28,
																			height: 28,
																			fontSize: "0.7rem",
																			background: `rgb(${TASK_STATUS_COLORS[t.status][0]})`
																		},
																		children: t.assignee
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: `fw-semibold ${isDark ? "text-white" : "text-dark"}`,
																		style: { fontSize: "13px" },
																		children: t.name
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "text-muted",
																		style: { fontSize: "11px" },
																		children: [
																			t.status,
																			" • ",
																			t.progress,
																			"%"
																		]
																	})] })]
																})
															}, t.id))
														]
													})
												]
											})
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-xl-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
											style: { borderRadius: "16px" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "card-body p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex justify-content-between align-items-center mb-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
														className: `fw-semibold mb-0 ${isDark ? "text-white" : "text-dark"}`,
														children: "Top Web App & Usage"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														className: "btn btn-sm rounded-pill px-3 border-0 fw-bold d-flex align-items-center gap-1",
														style: {
															background: "linear-gradient(135deg, #4F46E5, #7c3aed)",
															color: "#fff",
															fontSize: "0.75rem"
														},
														onClick: openAddApp,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), " Add App"]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-4",
													children: [appUsage.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-center text-muted py-4",
														style: { fontSize: "13px" },
														children: [
															"No web apps tracked yet. Click ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Add App" }),
															" to begin."
														]
													}), appUsage.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex align-items-center justify-content-between py-2 px-3 rounded-3 transition-all",
														style: {
															cursor: app.url ? "pointer" : "default",
															background: "transparent"
														},
														onClick: () => {
															if (app.url) window.open(app.url, "_blank", "noopener,noreferrer");
														},
														onMouseEnter: (e) => {
															e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
														},
														onMouseLeave: (e) => {
															e.currentTarget.style.background = "transparent";
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex align-items-center gap-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: `rounded-3 d-flex align-items-center justify-content-center shadow-sm`,
																style: {
																	width: "42px",
																	height: "42px",
																	background: `${app.color}15`,
																	color: app.color,
																	fontSize: "1.2rem"
																},
																children: renderAppIcon(app)
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: `fw-semibold ${isDark ? "text-white" : "text-dark"}`,
																style: { fontSize: "16px" },
																children: app.name
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-muted",
																style: { fontSize: "12px" },
																children: app.category
															})] })]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex align-items-center gap-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "text-end",
																style: { width: "120px" },
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: `fw-bold small mb-1 ${isDark ? "text-white" : "text-dark"}`,
																	children: app.time
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "progress",
																	style: {
																		height: "6px",
																		borderRadius: "10px",
																		background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"
																	},
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "progress-bar rounded-pill",
																		style: {
																			width: `${app.progress}%`,
																			background: app.color
																		}
																	})
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "d-flex flex-column gap-1",
																children: [
																	app.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																		className: "btn btn-sm p-0",
																		style: {
																			fontSize: "0.7rem",
																			background: "transparent",
																			border: "none",
																			color: app.color
																		},
																		onClick: (e) => {
																			e.stopPropagation();
																			window.open(app.url, "_blank", "noopener,noreferrer");
																		},
																		title: "Open app",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExternalLinkAlt })
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																		className: "btn btn-sm p-0 text-primary",
																		style: {
																			fontSize: "0.7rem",
																			background: "transparent",
																			border: "none"
																		},
																		onClick: (e) => {
																			e.stopPropagation();
																			openEditApp(app);
																		},
																		title: "Edit",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																		className: "btn btn-sm p-0 text-danger",
																		style: {
																			fontSize: "0.7rem",
																			background: "transparent",
																			border: "none"
																		},
																		onClick: (e) => {
																			e.stopPropagation();
																			deleteApp(app.id);
																		},
																		title: "Remove",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrashAlt })
																	})
																]
															})]
														})]
													}, app.id))]
												})]
											})
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "row g-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-12",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `card border-0 shadow-sm rounded-4 overflow-hidden ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
											style: { borderRadius: "16px" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "card-body p-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "row g-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "col-lg-6 p-4 border-end",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "d-flex justify-content-between align-items-center mb-3",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
																	className: `fw-bold mb-0 ${isDark ? "text-dark-gray" : "text-dark"}`,
																	style: { fontFamily: "Inter, sans-serif" },
																	children: "Task Statistics"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																	className: "btn btn-outline-secondary btn-sm rounded-pill px-3 border-opacity-25 x-small",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																		icon: faFileExport,
																		className: "me-1"
																	}), " Export"]
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "opacity-10 mb-4" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "position-relative d-flex justify-content-center align-items-center",
																style: { minHeight: "260px" },
																children: taskStatsTotal === 0 && !taskLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "text-center text-muted",
																	style: { fontSize: "13px" },
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "text-muted x-small fw-medium mb-1",
																			children: "Total Task"
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: `h2 fw-black mb-0 ${isDark ? "text-white" : "text-dark"}`,
																			children: "0"
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "mt-2",
																			children: "No tasks found"
																		})
																	]
																}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	style: {
																		width: "220px",
																		height: "220px"
																	},
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
																		id: "task-statistics-donut",
																		data: taskStatsData,
																		options: {
																			responsive: true,
																			maintainAspectRatio: false,
																			cutout: "80%",
																			plugins: { legend: { display: false } }
																		}
																	})
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "position-absolute text-center",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "text-muted x-small fw-medium",
																		children: "Total Task"
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: `h2 fw-black mb-0 ${isDark ? "text-white" : "text-dark"}`,
																		children: taskStatsTotal
																	})]
																})] })
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "col-lg-6 d-flex flex-column",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "p-4 flex-grow-1",
															style: { background: isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA" },
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "rounded-3 overflow-hidden border border-opacity-10 shadow-sm",
																children: taskStatsRows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: `d-flex align-items-center justify-content-between p-3 transition-all ${isDark ? "hover-bg-white hover-bg-opacity-5" : "hover-bg-light"} ${i !== taskStatsRows.length - 1 ? "border-bottom" : ""}`,
																	style: { height: "50px" },
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "d-flex align-items-center gap-2",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "rounded-circle",
																			style: {
																				width: "10px",
																				height: "10px",
																				background: row.color
																			}
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "small fw-medium text-muted",
																			children: row.label
																		})]
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: `fw-bold small ${isDark ? "text-white" : "text-dark"}`,
																		children: row.value
																	})]
																}, row.label))
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "p-4 border-top mt-auto d-flex justify-content-between align-items-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-muted x-small fw-bold text-uppercase",
																children: "Task Completion Rate"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: `h5 mb-0 fw-black ${isDark ? "text-white" : "text-dark"}`,
																children: [taskStatsCompletionRate, "%"]
															})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "text-end",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 small fw-bold",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																			icon: faArrowUp,
																			className: "me-1"
																		}),
																		" ",
																		taskStatsCompletionRate,
																		"%"
																	]
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "text-muted x-small mt-1",
																	children: "based on live tasks"
																})]
															})]
														})]
													})]
												})
											})
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-xl-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
											style: {
												borderRadius: "16px",
												height: "100%"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "card-body p-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex justify-content-between align-items-center mb-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
															className: `fw-semibold mb-0 ${isDark ? "text-white" : "text-dark"}`,
															style: {
																fontFamily: "'Poppins', 'Inter', sans-serif",
																fontSize: "20px"
															},
															children: "Recent Tasks"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex gap-2 align-items-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "dropdown",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	className: "btn btn-light-primary btn-sm rounded-circle dropdown-toggle",
																	"data-bs-toggle": "dropdown",
																	"aria-expanded": "false",
																	title: "Filter by status",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFilter })
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
																	className: "dropdown-menu dropdown-menu-end shadow-sm py-1",
																	style: { borderRadius: "12px" },
																	children: taskFilterOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																		className: `dropdown-item small ${taskFilter === opt ? "active" : ""}`,
																		style: { borderRadius: "8px" },
																		onClick: () => setTaskFilter(opt),
																		children: opt
																	}) }, opt))
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																className: "btn btn-light-primary btn-sm rounded-circle",
																title: "Add Task",
																onClick: () => setActiveTab("pms_tasks"),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus })
															})]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "opacity-10 mb-4" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2 overflow-y-scroll custom-work-queue-scroll",
														style: {
															maxHeight: "400px",
															paddingRight: "4px"
														},
														children: [visibleTasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-center text-muted py-4",
															style: { fontSize: "13px" },
															children: detailedRecentTasks.length === 0 ? "No tasks found." : `No ${taskFilter !== "All" ? taskFilter : ""} tasks.`
														}), visibleTasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: `task-row-hover d-flex align-items-center gap-3 p-3 rounded-4 ${isDark ? "hover-bg-white hover-bg-opacity-5" : "hover-bg-light"}`,
															style: {
																cursor: "pointer",
																transition: "all 0.3s ease",
																border: isDark ? "1px solid rgba(255,255,255,0.03)" : "1px solid transparent"
															},
															onClick: () => setActiveTab("pms_tasks"),
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "d-flex align-items-center gap-2 flex-shrink-0",
																	style: { width: "56px" },
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "rounded-3 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm position-relative",
																		style: {
																			width: 40,
																			height: 40,
																			background: `linear-gradient(135deg, ${task.color}, ${task.color}dd)`,
																			fontSize: 13
																		},
																		children: [task.initials, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "position-absolute rounded-circle border border-2 border-white",
																			style: {
																				width: 10,
																				height: 10,
																				bottom: -3,
																				right: -3,
																				background: task.priority === "high" ? "#ef4444" : task.priority === "medium" ? "#f59e0b" : "#9ca3af"
																			}
																		})]
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-muted",
																		style: {
																			fontSize: 10,
																			cursor: "pointer"
																		},
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																			icon: faEllipsisH,
																			className: "opacity-30"
																		})
																	})]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex-grow-1 min-w-0",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: `fw-semibold small ${isDark ? "text-white" : "text-dark"}`,
																			style: { fontSize: 14 },
																			children: task.projectName
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "text-muted",
																			style: { fontSize: 12 },
																			children: task.description
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "d-flex align-items-center gap-3 mt-2",
																			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																				className: "d-flex align-items-center gap-1",
																				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																					src: task.assignee,
																					alt: "",
																					className: "rounded-circle border border-white border-1 shadow-sm",
																					style: {
																						width: 20,
																						height: 20
																					}
																				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																					className: "text-muted",
																					style: { fontSize: 10 },
																					children: task.dueDate
																				})]
																			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																				className: "flex-grow-1",
																				style: { maxWidth: 120 },
																				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																					className: "progress",
																					style: {
																						height: 4,
																						borderRadius: 4,
																						background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
																					},
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																						className: "progress-bar rounded-pill",
																						style: {
																							width: `${task.progress}%`,
																							background: task.status === "Completed" ? "#10B981" : task.status === "Overdue" ? "#ef4444" : "#4F46E5"
																						}
																					})
																				})
																			})]
																		})
																	]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "text-end flex-shrink-0",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: `fw-bold small ${isDark ? "text-white" : "text-dark"}`,
																			style: { fontSize: 12 },
																			children: task.estimatedTime
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "badge rounded-pill px-2 py-1 small fw-bold",
																			style: {
																				fontSize: 10,
																				background: task.status === "Ongoing" ? "rgba(13,110,253,0.12)" : task.status === "Completed" ? "rgba(16,185,129,0.12)" : task.status === "Review" ? "rgba(245,158,11,0.12)" : task.status === "Pending" ? "rgba(111,66,193,0.12)" : "rgba(239,68,68,0.12)",
																				color: task.status === "Ongoing" ? "#0d6efd" : task.status === "Completed" ? "#10B981" : task.status === "Review" ? "#f59e0b" : task.status === "Pending" ? "#6f42c1" : "#ef4444"
																			},
																			children: task.status
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																			className: "btn btn-link p-0 ms-1 text-muted",
																			style: { fontSize: 12 },
																			onClick: (e) => {
																				e.stopPropagation();
																				setActiveTab("pms_tasks");
																			},
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEllipsisH })
																		})
																	]
																})
															]
														}, task.id || task.code))]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														className: "btn btn-outline-secondary w-100 rounded-pill mt-4 fw-bold py-2 border-opacity-25 transition-all hover-lift",
														style: { fontSize: 13 },
														onClick: () => setActiveTab("pms_tasks"),
														children: ["View All Tasks ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faChevronRight,
															className: "ms-1 small"
														})]
													})
												]
											})
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-xl-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
											style: { borderRadius: "16px" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "card-body p-4 d-flex flex-column",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex justify-content-between align-items-center mb-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
															className: `fw-semibold mb-0 ${isDark ? "text-white" : "text-dark"}`,
															style: {
																fontFamily: "'Poppins', 'Inter', sans-serif",
																fontSize: "20px"
															},
															children: "Work By Hours"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																className: "btn btn-light-primary btn-sm rounded-pill px-2 fw-bold small",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																	icon: faCalendarAlt,
																	className: "me-1"
																}), "This Week"]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																className: "btn btn-light-primary btn-sm rounded-circle",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileExport })
															})]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "opacity-10 mb-3" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "position-relative",
														children: [heatmapLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-center text-muted py-5",
															style: { fontSize: "13px" },
															children: "Loading work heatmap…"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex mb-1 w-100",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 48 } }), renderDays.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-center text-muted fw-bold flex-grow-1",
																style: { fontSize: 11 },
																children: d
															}, d))]
														}), renderHours.map((hour, hi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex align-items-center mb-1 w-100",
															style: { height: 28 },
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-muted fw-bold flex-shrink-0",
																style: {
																	width: 48,
																	fontSize: 9
																},
																children: hour
															}), renderDays.map((day, di) => {
																const cell = heatmapData[di]?.[hi] || {
																	tasks: 0,
																	hours: 0
																};
																const level = cellLevel(cell.hours);
																const bg = [
																	isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
																	isDark ? "rgba(131,104,254,0.2)" : "rgba(79, 70, 229, 0.2)",
																	isDark ? "rgba(131,104,254,0.4)" : "rgba(79, 70, 229, 0.4)",
																	isDark ? "rgba(131,104,254,0.6)" : "rgba(79, 70, 229, 0.6)",
																	isDark ? "rgba(131,104,254,0.8)" : "rgba(79, 70, 229, 0.8)"
																][level];
																return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "heatmap-cell flex-shrink-0 transition-all",
																	style: {
																		flexGrow: 1,
																		height: 28,
																		minWidth: 8,
																		margin: "0 3px",
																		borderRadius: 6,
																		background: bg,
																		cursor: "pointer"
																	},
																	onMouseEnter: (e) => setTooltip({
																		show: true,
																		day,
																		hour,
																		tasks: cell.tasks,
																		hours: Number(cell.hours).toFixed(1),
																		x: e.clientX,
																		y: e.clientY
																	}),
																	onMouseLeave: () => setTooltip({ show: false })
																}, `${day}-${hour}`);
															})]
														}, hour))] }), tooltip.show && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: `heatmap-tooltip shadow-lg rounded-3 border px-3 py-2 transition-all ${isDark ? "bg-dark-card border-white border-opacity-10 text-white" : "bg-white border-gray-200"}`,
															style: {
																position: "fixed",
																left: tooltip.x + 12,
																top: tooltip.y - 10,
																zIndex: 9999,
																pointerEvents: "none",
																minWidth: 160,
																opacity: .98
															},
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "fw-bold small",
																	style: { fontSize: 13 },
																	children: [
																		tooltip.day,
																		" · ",
																		tooltip.hour
																	]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "text-muted",
																	style: { fontSize: 11 },
																	children: [tooltip.tasks, " Tasks Completed"]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "text-muted",
																	style: { fontSize: 11 },
																	children: [tooltip.hours, " Productive Hours"]
																})
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "d-flex align-items-center justify-content-center gap-3 mt-3 mb-4",
														children: [
															{
																label: "None",
																level: 0
															},
															{
																label: "Low",
																level: 1
															},
															{
																label: "Moderate",
																level: 2
															},
															{
																label: "High",
																level: 3
															},
															{
																label: "Peak",
																level: 4
															}
														].map((item) => {
															const bg = [
																isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
																isDark ? "rgba(131,104,254,0.2)" : "rgba(79, 70, 229, 0.2)",
																isDark ? "rgba(131,104,254,0.4)" : "rgba(79, 70, 229, 0.4)",
																isDark ? "rgba(131,104,254,0.6)" : "rgba(79, 70, 229, 0.6)",
																isDark ? "rgba(131,104,254,0.8)" : "rgba(79, 70, 229, 0.8)"
															][item.level];
															return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "d-flex align-items-center gap-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "rounded",
																	style: {
																		width: 12,
																		height: 12,
																		background: bg
																	}
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted",
																	style: { fontSize: 9 },
																	children: item.label
																})]
															}, item.label);
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "row g-2 mt-auto pt-3 border-top",
														children: [
															{
																label: "Best Day",
																value: analyticsSummary.bestDay,
																icon: faCalendarAlt,
																color: "#4F46E5"
															},
															{
																label: "Best Hour",
																value: analyticsSummary.bestHour,
																icon: faClock,
																color: "#f59e0b"
															},
															{
																label: "Weekly Score",
																value: `${analyticsSummary.weeklyScore}%`,
																icon: faChartLine,
																color: "#10B981"
															},
															{
																label: "Total Hours",
																value: `${analyticsSummary.totalHours}h`,
																icon: faBriefcase,
																color: "#06b6d4"
															},
															{
																label: "Avg Daily",
																value: `${analyticsSummary.avgDaily}h`,
																icon: faLayerGroup,
																color: "#7c3aed"
															}
														].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "col",
															style: { minWidth: 0 },
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: `p-2 rounded-3 text-center ${isDark ? "bg-white bg-opacity-5" : "bg-light"} h-100`,
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																		icon: stat.icon,
																		className: "mb-1",
																		style: {
																			color: stat.color,
																			fontSize: 12
																		}
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "fw-bold",
																		style: {
																			fontSize: 11,
																			color: isDark ? "#f8fafc" : "#111827"
																		},
																		children: stat.value
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "text-muted",
																		style: {
																			fontSize: 9,
																			whiteSpace: "nowrap"
																		},
																		children: stat.label
																	})
																]
															})
														}, stat.label))
													})
												]
											})
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-xl-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `card border-0 shadow-sm h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
											style: {
												borderRadius: "24px",
												border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
													className: `fw-black mb-0 ${isDark ? "text-white" : "text-dark"}`,
													children: "Live System Feed"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-link p-0 text-primary text-decoration-none small fw-bold",
													children: "View History"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "card-body p-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "space-y-4",
													children: recentActivities.map((activity) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex gap-3 p-3 rounded-4 transition-all hover-bg-light",
														style: { background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)" },
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: `rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm`,
															style: {
																width: "48px",
																height: "48px",
																background: `rgba(var(--bs-${activity.color}-rgb), 0.1)`,
																color: `var(--bs-${activity.color})`
															},
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: activity.icon })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex-grow-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "d-flex justify-content-between align-items-center mb-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
																	className: `mb-0 fw-bold small ${isDark ? "text-white" : "text-dark"}`,
																	children: activity.user
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "x-small text-muted",
																	children: activity.time
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-muted x-small mb-0 fw-medium",
																children: activity.action
															})]
														})]
													}, activity.id))
												})
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-xl-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "card border-0 shadow-2xl h-100 bg-primary text-white overflow-hidden",
											style: { borderRadius: "24px" },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "position-absolute top-0 end-0 p-0 opacity-10",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faShieldHalved,
													style: {
														fontSize: "20rem",
														transform: "translate(20%, -20%)"
													}
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "card-body p-5 position-relative z-1 d-flex flex-column h-100",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-auto",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex align-items-center gap-2 mb-4",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "bg-white bg-opacity-20 p-2 rounded-3",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																	icon: faLock,
																	color: "grey"
																})
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
																className: "fw-black mb-0 text-black",
																children: "Elite Security Protocol"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
															className: "fw-black mb-4 ls-tight text-black",
															children: "Fortified Governance Control"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-4 mb-5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "d-flex align-items-center gap-3 p-3 rounded-4 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-10",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																	icon: faCheckCircle,
																	className: "text-success"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex-grow-1",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "small fw-black",
																		children: "SSL Enforcement"
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "x-small opacity-70",
																		children: "256-bit AES encryption active"
																	})]
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "d-flex align-items-center gap-3 p-3 rounded-4 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-10",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																		icon: faExclamationCircle,
																		className: "text-warning"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "flex-grow-1",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "small fw-black",
																			children: "Traffic Anomaly Detection"
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "x-small opacity-70",
																			children: "3 minor alerts intercepted today"
																		})]
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "badge bg-white text-primary rounded-pill px-2",
																		children: "Audit"
																	})
																]
															})]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "row g-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "col-sm-6",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "btn btn-white w-100 rounded-pill fw-black text-primary py-3 shadow-lg",
															children: "Security Center"
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "col-sm-6",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "btn btn-primary border border-white border-opacity-20 w-100 rounded-pill fw-black py-3 backdrop-blur-md",
															children: "Compliance Logs"
														})
													})]
												})]
											})]
										})
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TmsRightSidePanel, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-xl-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
										style: { borderRadius: "16px" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "card-body p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex justify-content-between align-items-center mb-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
														className: `fw-semibold mb-0 ${isDark ? "text-white" : "text-dark"}`,
														style: { fontFamily: "Poppins, sans-serif" },
														children: ["Team Members", teamLoading ? "" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-muted fw-normal ms-1",
															style: { fontSize: "13px" },
															children: [
																"(",
																teamMembers.length,
																")"
															]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "btn btn-light-primary btn-sm rounded-circle",
															title: "Search members",
															onClick: () => setShowTeamSearch((v) => !v),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "btn btn-light-primary btn-sm rounded-circle",
															title: "Add member",
															onClick: () => setActiveTab("add-user"),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus })
														})]
													})]
												}),
												showTeamSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mb-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control form-control-sm",
														placeholder: "Search by name or role…",
														value: teamSearch,
														autoFocus: true,
														onChange: (e) => setTeamSearch(e.target.value),
														style: { borderRadius: "12px" }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "opacity-10 mb-4" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-4 custom-work-queue-scroll overflow-y-auto",
													style: {
														maxHeight: "340px",
														paddingRight: "4px"
													},
													children: [
														teamLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-center text-muted py-3",
															style: { fontSize: "13px" },
															children: "Loading members…"
														}),
														!teamLoading && filteredTeamMembers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-center text-muted py-3",
															style: { fontSize: "13px" },
															children: teamMembers.length === 0 ? "No team members found." : "No matches."
														}),
														filteredTeamMembers.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: `d-flex align-items-center justify-content-between p-2 rounded-3 transition-all ${isDark ? "hover-bg-white hover-bg-opacity-5" : "hover-bg-light"}`,
															style: { cursor: "pointer" },
															onClick: () => setActiveTab("users"),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "d-flex align-items-center gap-3",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "position-relative",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																		src: member.avatar,
																		alt: member.name,
																		className: "rounded-circle border border-2 border-white shadow-sm transition-all hover-scale",
																		style: {
																			width: "44px",
																			height: "44px"
																		}
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "position-absolute bottom-0 end-0 rounded-circle border border-white",
																		style: {
																			width: "10px",
																			height: "10px",
																			background: member.online ? "#22c55e" : member.experience === "Active" ? "#22c55e" : "#94a3b8"
																		}
																	})]
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: `fw-semibold small ${isDark ? "text-white" : "text-dark"}`,
																	children: member.name
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "text-muted",
																	style: { fontSize: "12px" },
																	children: member.position
																})] })]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "badge rounded-pill px-3 py-1 shadow-sm",
																style: {
																	background: `${member.color}15`,
																	color: member.color,
																	fontSize: "11px",
																	fontWeight: "700"
																},
																children: member.experience
															})]
														}, member.id || member.name))
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-light-primary w-100 rounded-pill mt-4 fw-bold",
													onClick: () => setActiveTab("users"),
													children: "View Full Roster"
												})
											]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-xl-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
										style: { borderRadius: "16px" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "card-body p-4 d-flex flex-column",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex justify-content-between align-items-center mb-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
														className: `fw-semibold mb-0 ${isDark ? "text-white" : "text-dark"}`,
														children: "Production Statistics"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn btn-link p-0 text-muted",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileExport })
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "opacity-10 mb-4" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex-grow-1 position-relative d-flex justify-content-center align-items-center py-4",
													style: { minHeight: "260px" },
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														style: {
															width: "220px",
															height: "220px"
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
															id: "production-double-ring",
															data: productionDoubleRingData,
															options: {
																responsive: true,
																maintainAspectRatio: false,
																plugins: { legend: { display: false } },
																hover: { mode: "index" }
															}
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "position-absolute text-center",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-muted small fw-medium",
															children: "Total Hours"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: `h2 fw-bold mb-0 ${isDark ? "text-white" : "text-dark"}`,
															children: "348"
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "row g-0 border-top mt-auto pt-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "col-6 text-center border-end",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-muted x-small fw-bold text-uppercase mb-1",
															children: "Production"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: `h4 mb-0 fw-black text-primary`,
															children: "265"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "col-6 text-center",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-muted x-small fw-bold text-uppercase mb-1",
															children: "Manual"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: `h4 mb-0 fw-black text-warning`,
															children: "82"
														})]
													})]
												})
											]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-xl-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
										style: { borderRadius: "16px" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "card-body p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex justify-content-between align-items-center mb-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
														className: `fw-semibold mb-0 ${isDark ? "text-white" : "text-dark"}`,
														children: "Recent Activity"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn btn-link p-0 text-muted",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEllipsisH })
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "opacity-10 mb-4" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "position-relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "position-absolute start-0 h-100 border-start opacity-10",
														style: {
															marginLeft: "19px",
															zIndex: 0
														}
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "space-y-4 position-relative z-1",
														children: saasActivities.map((act, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex gap-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm bg-white",
																style: {
																	width: "40px",
																	height: "40px",
																	border: `2px solid ${act.color}`
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																	icon: act.icon,
																	style: { color: act.color },
																	className: "small"
																})
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex-grow-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "d-flex justify-content-between align-items-center mb-1",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: `fw-semibold small ${isDark ? "text-white" : "text-dark"}`,
																		children: act.title
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "x-small text-muted",
																		children: act.time
																	})]
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "text-muted",
																	style: { fontSize: "12.5px" },
																	children: act.desc
																})]
															})]
														}, i))
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-outline-secondary w-100 rounded-pill mt-4 fw-bold py-2 border-opacity-25",
													children: "View All Logs"
												})
											]
										})
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-xl-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
									style: { borderRadius: "16px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "card-body p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex justify-content-between align-items-center mb-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: `fw-semibold mb-0 ${isDark ? "text-white" : "text-dark"}`,
													children: "Project Statistics"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn btn-light-primary btn-sm rounded-circle",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn btn-light-primary btn-sm rounded-circle",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFilter })
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "opacity-10 mb-4" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "d-flex justify-content-center gap-4 mb-4",
												children: [
													"Active",
													"In Progress",
													"Completed"
												].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "rounded-circle",
														style: {
															width: 10,
															height: 10,
															background: i === 0 ? "#4F46E5" : i === 1 ? "#F59E0B" : "#10B981"
														}
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "x-small fw-bold text-muted",
														children: label
													})]
												}, label))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: { height: "320px" },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													id: "project-stats-chart",
													data: projectStatsData,
													options: {
														responsive: true,
														maintainAspectRatio: false,
														plugins: { legend: { display: false } },
														scales: {
															x: {
																grid: { display: false },
																ticks: {
																	font: {
																		size: 11,
																		weight: "600"
																	},
																	color: isDark ? "#94a3b8" : "#64748b"
																}
															},
															y: {
																grid: {
																	color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
																	drawBorder: false
																},
																ticks: {
																	font: {
																		size: 11,
																		weight: "600"
																	},
																	color: isDark ? "#94a3b8" : "#64748b"
																}
															}
														}
													}
												})
											})
										]
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-xl-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
									style: { borderRadius: "16px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "card-body p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: `fw-semibold mb-4 ${isDark ? "text-white" : "text-dark"}`,
												children: "Recent Projects"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "opacity-10 mb-4" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "space-y-3",
												children: recentProjects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `d-flex align-items-center justify-content-between p-3 rounded-4 transition-all hover-lift cursor-pointer ${isDark ? "hover-bg-white hover-bg-opacity-5" : "hover-bg-light"}`,
													style: { background: isDark ? "rgba(255,255,255,0.02)" : project.bg },
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex align-items-center gap-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "rounded-3 d-flex align-items-center justify-content-center text-white fw-black shadow-sm",
															style: {
																width: 44,
																height: 44,
																background: project.color
															},
															children: project.id
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: `fw-bold mb-0 ${isDark ? "text-white" : "text-dark"}`,
																style: { fontSize: "15px" },
																children: project.name
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-muted",
																style: { fontSize: "12px" },
																children: project.category
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "x-small text-muted mt-1 fw-medium",
																children: [
																	project.tasks,
																	" Tasks • ",
																	project.budget
																]
															})
														] })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "d-flex align-items-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "avatar-group d-flex align-items-center",
															children: [project.team.map((avatar, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: avatar,
																alt: "team",
																className: "rounded-circle border border-white border-2 shadow-sm transition-all hover-scale",
																style: {
																	width: "32px",
																	height: "32px",
																	marginLeft: i === 0 ? 0 : "-12px",
																	zIndex: 10 - i
																}
															}, i)), project.tasks > 50 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "rounded-circle border border-white border-2 shadow-sm bg-light d-flex align-items-center justify-content-center x-small fw-bold text-muted",
																style: {
																	width: "32px",
																	height: "32px",
																	marginLeft: "-12px",
																	zIndex: 0
																},
																children: "+3"
															})]
														})
													})]
												}, project.name))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-outline-secondary w-100 rounded-pill mt-4 fw-bold py-2 border-opacity-25",
												children: "View All Projects"
											})
										]
									})
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-xl-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `card rounded-5 shadow-sm border-0 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
										style: { border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "card-body p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center justify-content-between mb-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
														className: "text-uppercase text-muted fw-bold mb-1",
														style: {
															letterSpacing: "0.1em",
															fontSize: "0.7rem"
														},
														children: "Top Performers"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
														className: `mb-0 fw-black ${isDark ? "text-white" : "text-dark"}`,
														children: "Team Leaders"
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill small fw-bold",
														children: [members.length, " Active"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "space-y-2",
													children: members.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: `d-flex align-items-center justify-content-between p-3 rounded-4 transition-all ${isDark ? "hover-bg-white hover-bg-opacity-5" : "hover-bg-light"}`,
														style: { cursor: "pointer" },
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex align-items-center gap-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "rounded-circle d-flex align-items-center justify-content-center text-white fw-black flex-shrink-0 shadow-sm",
																style: {
																	width: 44,
																	height: 44,
																	background: `linear-gradient(135deg, ${member.accent}, ${member.accent}dd)`
																},
																children: member.initials
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: `fw-bold small mb-0 ${isDark ? "text-white" : "text-dark"}`,
																children: member.name
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
																className: "text-muted fw-medium",
																children: member.role
															})] })]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-end",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: `badge rounded-pill bg-${member.color} bg-opacity-10 text-${member.color} px-3 py-1 mb-1`,
																style: { fontSize: "0.65rem" },
																children: member.badge
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-muted fw-bold",
																style: { fontSize: "0.7rem" },
																children: member.salary
															})]
														})]
													}, member.name))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-light-primary w-100 rounded-pill mt-4 fw-bold py-2",
													children: "View Full Roster"
												})
											]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-xl-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `card rounded-5 shadow-sm border-0 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
										style: { border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "card-body p-4 d-flex flex-column",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center justify-content-between mb-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
														className: "text-uppercase text-muted fw-bold mb-1",
														style: {
															letterSpacing: "0.1em",
															fontSize: "0.7rem"
														},
														children: "Skill Matrix"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
														className: `mb-0 fw-black ${isDark ? "text-white" : "text-dark"}`,
														children: "Operational Competency"
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faCubes,
														className: "text-muted opacity-25 fs-4"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex-grow-1 py-3",
													style: { minHeight: 320 },
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
														data: radarData,
														options: {
															responsive: true,
															maintainAspectRatio: false,
															scales: { r: {
																grid: { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
																angleLines: { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
																pointLabels: {
																	color: isDark ? "#f8f9fa" : "#6c757d",
																	font: {
																		size: 11,
																		weight: "600"
																	}
																},
																ticks: { display: false }
															} },
															plugins: { legend: {
																position: "bottom",
																labels: {
																	color: isDark ? "#adb5bd" : "#6c757d",
																	font: {
																		weight: 600,
																		size: 11
																	},
																	usePointStyle: true,
																	padding: 20
																}
															} }
														}
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-4 p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-10",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex align-items-center gap-2 mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faBolt,
															className: "text-primary small"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "small fw-bold text-primary",
															children: "Optimization Tip"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "x-small text-muted mb-0 fw-medium",
														children: "Based on recent metrics, security compliance is 12% higher than previous Q3."
													})]
												})
											]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-xl-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `card rounded-5 shadow-sm border-0 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
										style: { border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "card-body p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center justify-content-between mb-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
														className: "text-uppercase text-muted fw-bold mb-1",
														style: {
															letterSpacing: "0.1em",
															fontSize: "0.7rem"
														},
														children: "Governance"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
														className: `mb-0 fw-black ${isDark ? "text-white" : "text-dark"}`,
														children: "Pending Approvals"
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "badge bg-warning bg-opacity-10 text-warning px-3 py-1 rounded-pill small fw-bold",
														children: [approvals.length, " Urgent"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "space-y-2",
													children: approvals.map((approval) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: `d-flex align-items-center justify-content-between p-3 rounded-4 transition-all ${isDark ? "hover-bg-white hover-bg-opacity-5" : "hover-bg-light"}`,
														style: { cursor: "pointer" },
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex align-items-center gap-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "rounded-circle d-flex align-items-center justify-content-center text-white fw-black flex-shrink-0 shadow-sm",
																style: {
																	width: 42,
																	height: 42,
																	background: `linear-gradient(135deg, ${approval.accent}, ${approval.accent}dd)`
																},
																children: approval.initials.charAt(0)
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: `fw-bold small mb-0 ${isDark ? "text-white" : "text-dark"}`,
																children: approval.name
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
																className: "text-muted fw-medium",
																style: { fontSize: "0.7rem" },
																children: ["🕐 ", approval.time]
															})] })]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																className: "btn btn-sm rounded-circle d-flex align-items-center justify-content-center transition-all bg-success bg-opacity-10 text-success border-0 hover-lift shadow-sm",
																style: {
																	width: 34,
																	height: 34
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckCircle })
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																className: "btn btn-sm rounded-circle d-flex align-items-center justify-content-center transition-all bg-danger bg-opacity-10 text-danger border-0 hover-lift shadow-sm",
																style: {
																	width: 34,
																	height: 34
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																	icon: faCircle,
																	className: "small"
																})
															})]
														})]
													}, approval.name))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-outline-secondary w-100 rounded-pill mt-4 fw-bold py-2 border-opacity-25",
													children: "View All Requests"
												})
											]
										})
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-xl-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `card rounded-5 shadow-sm border-0 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
									style: { border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "card-body p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center justify-content-between mb-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
												className: "text-uppercase text-muted fw-bold mb-1",
												style: {
													letterSpacing: "0.1em",
													fontSize: "0.7rem"
												},
												children: "Velocity Analytics"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
												className: `mb-0 fw-black ${isDark ? "text-white" : "text-dark"}`,
												children: "Enterprise Performance Trends"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "d-flex gap-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-light-primary btn-sm rounded-pill px-4 fw-bold",
													children: "Report"
												})
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: { minHeight: 360 },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												data: performanceData,
												options: {
													responsive: true,
													maintainAspectRatio: false,
													interaction: {
														intersect: false,
														mode: "index"
													},
													plugins: {
														legend: {
															position: "bottom",
															labels: {
																color: isDark ? "#adb5bd" : "#6c757d",
																font: {
																	weight: 600,
																	size: 11
																},
																usePointStyle: true,
																padding: 25
															}
														},
														tooltip: {
															backgroundColor: isDark ? "#1e293b" : "#212529",
															titleFont: {
																size: 13,
																weight: "bold"
															},
															padding: 12,
															cornerRadius: 12,
															usePointStyle: true
														}
													},
													scales: {
														x: {
															grid: { display: false },
															ticks: {
																color: isDark ? "#64748b" : "#6c757d",
																font: {
																	weight: "600",
																	size: 11
																}
															}
														},
														y: {
															grid: {
																color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
																drawBorder: false
															},
															ticks: {
																color: isDark ? "#64748b" : "#6c757d",
																font: {
																	weight: "600",
																	size: 11
																}
															},
															beginAtZero: true,
															max: 100
														}
													}
												}
											})
										})]
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-xl-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `card rounded-5 shadow-sm border-0 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
									style: { border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "card-body p-4 d-flex flex-column",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center justify-content-between mb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
												className: "text-uppercase text-muted fw-bold mb-1",
												style: {
													letterSpacing: "0.1em",
													fontSize: "0.7rem"
												},
												children: "✅ Productivity"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
												className: `mb-0 fw-black ${isDark ? "text-white" : "text-dark"}`,
												children: "Active Work"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "badge bg-danger bg-opacity-10 text-danger px-3 py-1 rounded-pill small fw-bold",
												children: [recentTasks.length, " Units"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-1",
											children: recentTasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `d-flex align-items-center justify-content-between p-3 rounded-4 transition-all ${isDark ? "hover-bg-white hover-bg-opacity-5" : "hover-bg-light"}`,
												style: { cursor: "pointer" },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "rounded-4 d-flex align-items-center justify-content-center text-white fw-black flex-shrink-0 shadow-sm",
														style: {
															width: 44,
															height: 44,
															background: task.color
														},
														children: task.code
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `fw-bold small mb-0 ${isDark ? "text-white" : "text-dark"}`,
														children: task.title
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
														className: "text-muted fw-medium",
														children: task.subtitle
													})] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-end",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `fw-black small ${task.status === "Ongoing" ? "text-warning" : "text-success"}`,
														children: task.duration
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
														className: "text-muted fw-bold",
														style: { fontSize: "0.65rem" },
														children: task.status
													})]
												})]
											}, task.code))
										})]
									})
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-xl-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between mb-4 mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
								className: `fw-black mb-0 d-flex align-items-center gap-3 ${isDark ? "text-white" : "text-dark"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-primary bg-opacity-10 p-2 rounded-3 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faCubes,
										className: "small"
									})
								}), "Integrated Service Modules"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-light-primary btn-sm rounded-pill px-4 fw-bold shadow-sm",
								children: "Explore Hub"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row g-4 mb-5",
							children: [
								{
									label: "Governance",
									desc: "Security protocols & access levels",
									icon: faShieldHalved,
									color: "danger",
									tab: "permissions"
								},
								{
									label: "Role Engine",
									desc: "Enterprise organizational mapping",
									icon: faUserTag,
									color: "success",
									tab: "roles"
								},
								{
									label: "User Directory",
									desc: "Global personnel data management",
									icon: faUsers,
									color: "primary",
									tab: "users"
								},
								{
									label: "Data Fortress",
									desc: "Redundant backup & point restoration",
									icon: faDatabase,
									color: "info",
									tab: "data-backup"
								},
								{
									label: "Aesthetic Lab",
									desc: "System-wide visual personalization",
									icon: faPlus,
									color: "warning",
									tab: "theme"
								},
								{
									label: "Navigation",
									desc: "Dynamic interface configuration",
									icon: faCubes,
									color: "secondary",
									tab: "topnavbar-settings"
								}
							].map((mod, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-xl-2 col-lg-4 col-md-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutButton, {
									label: mod.label,
									description: mod.desc,
									icon: mod.icon,
									color: mod.color,
									onClick: () => setActiveTab(mod.tab),
									isDark
								})
							}, idx))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row g-4 mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-12",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `card rounded-5 shadow-sm border-0 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
									style: { border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "card-body p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex justify-content-between align-items-center mb-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
													className: "text-uppercase text-muted fw-bold mb-1",
													style: {
														letterSpacing: "0.1em",
														fontSize: "0.7rem"
													},
													children: "Personnel Registry"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
													className: `mb-0 fw-black ${isDark ? "text-white" : "text-dark"}`,
													children: "Enterprise Member Directory"
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													className: "btn btn-primary rounded-pill px-4 fw-black shadow-sm",
													onClick: () => setActiveTab("add-user"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faPlus,
														className: "me-2"
													}), " Add Personnel"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "table-responsive",
												children: directoryLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-center text-muted py-4",
													style: { fontSize: "13px" },
													children: "Loading member directory…"
												}) : projectTable.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-center text-muted py-4",
													style: { fontSize: "13px" },
													children: "No personnel records found."
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
													className: "table table-borderless align-middle mb-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
														className: "text-muted small text-uppercase fw-black",
														style: { letterSpacing: "0.05em" },
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																className: "pb-4",
																children: "Full Identity"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																className: "pb-4",
																children: "Designation"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																className: "pb-4",
																children: "Digital Contact"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																className: "pb-4",
																children: "Experience"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																className: "pb-4",
																children: "Work Vector"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																className: "pb-4 text-end",
																children: "Status"
															})
														]
													}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visibleDirectory.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
														className: `transition-all ${isDark ? "hover-bg-white hover-bg-opacity-5" : "hover-bg-light"}`,
														style: { cursor: "pointer" },
														onClick: () => setActiveTab("users"),
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "py-4",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "d-flex align-items-center gap-3",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "rounded-circle bg-primary bg-opacity-10 text-primary fw-black d-flex align-items-center justify-content-center shadow-sm",
																		style: {
																			width: 40,
																			height: 40
																		},
																		children: row.name.charAt(0)
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: `fw-bold ${isDark ? "text-white" : "text-dark"}`,
																		children: row.name
																	})]
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "text-muted fw-medium",
																children: row.role
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "text-muted fw-medium",
																children: row.email
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "text-muted fw-medium",
																children: row.exp
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "text-muted fw-medium",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: `badge bg-opacity-10 rounded-pill px-3 ${row.location && row.location.toLowerCase().includes("remote") ? "bg-info text-info" : "bg-primary text-primary"}`,
																	children: row.location
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "text-end",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: `badge rounded-pill px-3 py-1 ${row.status === "Active" ? "bg-success bg-opacity-10 text-success" : "bg-secondary bg-opacity-10 text-muted"}`,
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																			icon: faCircle,
																			className: "x-small me-1",
																			style: { fontSize: "6px" }
																		}),
																		" ",
																		row.status
																	]
																})
															})
														]
													}, row.id)) })]
												})
											}),
											!directoryLoading && directoryTotalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex justify-content-end align-items-center gap-2 mt-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn btn-sm btn-outline-secondary rounded-pill px-3",
														disabled: directoryPage === 1,
														onClick: () => setDirectoryPage((p) => Math.max(1, p - 1)),
														children: "Prev"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "small text-muted fw-bold",
														children: [
															directoryPage,
															" / ",
															directoryTotalPages
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn btn-sm btn-outline-secondary rounded-pill px-3",
														disabled: directoryPage === directoryTotalPages,
														onClick: () => setDirectoryPage((p) => Math.min(directoryTotalPages, p + 1)),
														children: "Next"
													})
												]
											})
										]
									})
								})
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;600;700;900&display=swap');
        .admin-dashboard { font-family: 'Inter', sans-serif !important; }
        .fw-black { font-weight: 900 !important; }
        .ls-tight { letter-spacing: -0.04em !important; }
        .text-gradient-primary { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
        .shadow-3xl { box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3); }
        .backdrop-blur-xl { backdrop-filter: blur(24px); }
        .backdrop-blur-md { backdrop-filter: blur(12px); }
        .bg-dark-card { background: rgba(15, 23, 42, 0.6) !important; }
        .hover-bg-white:hover { background: rgba(255, 255, 255, 0.05) !important; }
        .hover-bg-light:hover { background: rgba(0, 0, 0, 0.02) !important; }
        .animate-pulse { animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse-soft { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(0.95); } }
        .pulse-dot { width: 8px; height: 8px; border-radius: 50%; animation: dot-pulse 2s infinite; }
        @keyframes dot-pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .space-y-2 > * + * { margin-top: 0.5rem; }
        .space-y-3 > * + * { margin-top: 0.75rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-6 > * + * { margin-top: 1.5rem; }
        .blur-4xl { filter: blur(100px); }
        .group-hover-translate-x { transition: transform 0.3s ease; }
        .group:hover .group-hover-translate-x { transform: translateX(4px); }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); }
        .hover-lift-lg:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; }
        .btn-light-primary { background-color: rgba(79, 70, 229, 0.05); color: #4F46E5; border: none; }
        .btn-light-primary:hover { background-color: rgba(79, 70, 229, 0.1); color: #4F46E5; }
        .btn-white { background-color: white; border: none; }
        .btn-white:hover { background-color: #f8f9fa; }
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animated-blob { animation: blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .progress { background-color: rgba(0,0,0,0.05); }
        .dark-mode .progress { background-color: rgba(255,255,255,0.05); }
        .card { animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .card:nth-child(1) { animation-delay: 0.1s; }
        .card:nth-child(2) { animation-delay: 0.2s; }
        .card:nth-child(3) { animation-delay: 0.3s; }
        .card:nth-child(4) { animation-delay: 0.4s; }
        .x-small { font-size: 0.7rem; }
        .avatar-group img:hover { transform: scale(1.2) translateY(-2px); z-index: 50; }
        .task-row-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
        .task-row-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); background: rgba(79,70,229,0.02); }
        .dark-mode .task-row-hover:hover { background: rgba(255,255,255,0.04); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .heatmap-cell:hover { transform: scale(1.2); box-shadow: 0 2px 8px rgba(0,0,0,0.12); z-index: 5; position: relative; }
        .dark-mode .heatmap-cell:hover { box-shadow: 0 2px 8px rgba(255,255,255,0.1); }
        .heatmap-tooltip { animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      ` } }),
			showAppModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal fade show d-block",
				tabIndex: "-1",
				role: "dialog",
				style: {
					background: "rgba(0,0,0,0.5)",
					zIndex: 1080
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					role: "document",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `modal-content border-0 rounded-4 ${isDark ? "bg-dark-card text-white border-white border-opacity-10" : "bg-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-header border-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: `modal-title fw-bold ${isDark ? "text-white" : "text-dark"}`,
									children: editingApp ? "Edit Web App" : "Add Web App"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn-close",
									style: isDark ? { filter: "invert(1)" } : {},
									onClick: () => setShowAppModal(false),
									"aria-label": "Close"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: `form-label small fw-bold ${isDark ? "text-white-50" : "text-muted"}`,
											children: "App Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: `form-control rounded-3 ${isDark ? "bg-dark border-white border-opacity-10 text-white" : ""}`,
											placeholder: "e.g. VS Code",
											value: appForm.name,
											onChange: (e) => setAppForm({
												...appForm,
												name: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: `form-label small fw-bold ${isDark ? "text-white-50" : "text-muted"}`,
											children: "Category"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: `form-control rounded-3 ${isDark ? "bg-dark border-white border-opacity-10 text-white" : ""}`,
											placeholder: "e.g. Editor",
											value: appForm.category,
											onChange: (e) => setAppForm({
												...appForm,
												category: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: `form-label small fw-bold ${isDark ? "text-white-50" : "text-muted"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faExternalLinkAlt,
													className: "me-1",
													style: { fontSize: "0.7rem" }
												}),
												"App URL ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted fw-normal",
													style: { fontSize: "0.7rem" },
													children: "(optional)"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "input-group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `input-group-text rounded-start-3 border-0 ${isDark ? "bg-dark text-white-50 border-white border-opacity-10" : "bg-light text-muted"}`,
												style: { fontSize: "0.75rem" },
												children: "https://"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: `form-control rounded-end-3 ${isDark ? "bg-dark border-white border-opacity-10 text-white" : ""}`,
												placeholder: "app.example.com",
												value: appForm.url,
												onChange: (e) => setAppForm({
													...appForm,
													url: e.target.value
												})
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: `form-label small fw-bold ${isDark ? "text-white-50" : "text-muted"}`,
												children: "App Icon"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-3 mb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `rounded-3 d-flex align-items-center justify-content-center shadow-sm`,
													style: {
														width: "48px",
														height: "48px",
														background: `${appForm.color}15`,
														color: appForm.color,
														fontSize: "1.4rem"
													},
													children: appForm.iconUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: appForm.iconUrl,
														alt: "icon",
														style: {
															width: "1.6rem",
															height: "1.6rem",
															objectFit: "contain",
															borderRadius: "6px"
														}
													}) : appForm.iconFa ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: APP_ICON_OPTIONS[appForm.iconFa] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: {
															fontWeight: 800,
															fontSize: "1rem"
														},
														children: appForm.name.trim().charAt(0).toUpperCase() || "?"
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex flex-column gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "btn btn-sm rounded-pill px-3 border-0 fw-bold d-flex align-items-center gap-1 mb-0",
														style: {
															background: "rgba(79,70,229,0.12)",
															color: "#4F46E5",
															fontSize: "0.75rem",
															cursor: "pointer"
														},
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faUpload }),
															" Upload Icon",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																type: "file",
																accept: "image/*",
																className: "d-none",
																onChange: handleAppIconUpload
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														className: "btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold d-flex align-items-center gap-1",
														style: { fontSize: "0.75rem" },
														onClick: () => setAppForm((prev) => ({
															...prev,
															iconUrl: null
														})),
														disabled: !appForm.iconUrl && !appForm.iconFa,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTimes }), " Clear"]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "d-flex align-items-center gap-2 flex-wrap",
												children: Object.keys(APP_ICON_OPTIONS).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setAppForm((prev) => ({
														...prev,
														iconFa: key,
														iconUrl: null
													})),
													className: "rounded-circle border d-flex align-items-center justify-content-center",
													style: {
														width: 32,
														height: 32,
														color: appForm.iconFa === key ? appForm.color : "#6b7280",
														background: appForm.iconFa === key ? `${appForm.color}15` : "transparent",
														borderColor: appForm.iconFa === key ? appForm.color : "rgba(0,0,0,0.1)",
														cursor: "pointer"
													},
													title: key,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: APP_ICON_OPTIONS[key] })
												}, key))
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-2 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: `form-label small fw-bold ${isDark ? "text-white-50" : "text-muted"}`,
												children: "Hours Used"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "0",
												className: `form-control rounded-3 ${isDark ? "bg-dark border-white border-opacity-10 text-white" : ""}`,
												placeholder: "0",
												value: appForm.hours,
												onChange: (e) => setAppForm({
													...appForm,
													hours: e.target.value
												})
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: `form-label small fw-bold ${isDark ? "text-white-50" : "text-muted"}`,
												children: "Minutes Used"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "0",
												max: "59",
												className: `form-control rounded-3 ${isDark ? "bg-dark border-white border-opacity-10 text-white" : ""}`,
												placeholder: "0",
												value: appForm.minutes,
												onChange: (e) => setAppForm({
													...appForm,
													minutes: e.target.value
												})
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: `form-label small fw-bold d-flex justify-content-between ${isDark ? "text-white-50" : "text-muted"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Usage Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [appForm.progress, "%"] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: "0",
											max: "100",
											className: "form-range",
											value: appForm.progress,
											onChange: (e) => setAppForm({
												...appForm,
												progress: e.target.value
											}),
											style: { accentColor: appForm.color }
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: `form-label small fw-bold ${isDark ? "text-white-50" : "text-muted"}`,
											children: "Accent Color"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-2 flex-wrap",
											children: [[
												"#10B981",
												"#7c3aed",
												"#3B82F6",
												"#F59E0B",
												"#EF4444",
												"#06B6D4",
												"#8B5CF6",
												"#4F46E5"
											].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setAppForm({
													...appForm,
													color: c
												}),
												className: "rounded-circle border-0",
												style: {
													width: 28,
													height: 28,
													background: c,
													outline: appForm.color === c ? "3px solid #fff" : "none",
													boxShadow: appForm.color === c ? `0 0 0 2px ${c}` : "none",
													cursor: "pointer"
												}
											}, c)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "color",
												className: "form-control form-control-color rounded-circle border-0 p-0",
												style: {
													width: 28,
													height: 28
												},
												value: appForm.color,
												onChange: (e) => setAppForm({
													...appForm,
													color: e.target.value
												}),
												title: "Custom color"
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: `btn rounded-pill px-4 ${isDark ? "btn-outline-light" : "btn-outline-secondary"}`,
									onClick: () => setShowAppModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn rounded-pill px-4 border-0 fw-bold text-white",
									style: { background: "linear-gradient(135deg, #4F46E5, #7c3aed)" },
									onClick: saveApp,
									children: editingApp ? "Save Changes" : "Add App"
								})]
							})
						]
					})
				})
			})
		]
	});
};
//#endregion
export { AdminDashboardPage as default };
