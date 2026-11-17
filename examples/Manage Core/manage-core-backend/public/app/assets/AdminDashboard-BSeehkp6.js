import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ar as faFileAlt, Bs as faStar, Cn as faClock, Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Es as faSitemap, Fs as faSpinner, I as faArrowRight, Io as faRadiation, Js as faSync, Lc as faUser, Mn as faCode, Ms as faSortAmountDown, Na as faMicrochip, Q as faAward, Qc as faUserTag, Qt as faCheck, Rc as faUserCheck, Ri as faHeadset, Rn as faCoins, Sr as faExclamationCircle, Ui as faHistory, Us as faStop, Xc as faUserShield, Xn as faCubes, Xo as faRotateLeft, Yt as faChartLine, Zn as faDatabase, _t as faBoxes, aa as faKey, ao as faPause, ba as faLock, bl as useApp, bt as faBriefcase, d as useTranslation, da as faLayerGroup, ea as faInbox, fa as faLifeRing, fo as faPeopleGroup, gs as faShieldHalved, hc as faTowerBroadcast, hs as faShieldAlt, in as faChevronRight, ir as faDollarSign, is as faScaleBalanced, ji as faHandshake, jo as faProjectDiagram, ll as faWallet, lt as faBolt, mc as faTools, ms as faShield, nc as faTasks, oa as faKeyboard, on as faCircle, os as faSearch, ru as require_react, sc as faThLarge, ta as faIndustry, ti as faFilter, tl as faUsers, us as faServer, v as motion, vi as faGear, vl as FontAwesomeIcon, wo as faPlay, xi as faGlobe, y as AnimatePresence, yt as faBrain } from "./ai-BHgPkVLC.js";
import { Br as getPreferences, Vr as updatePreferences, Wr as getSystemModules } from "./fms-BQz62Xux.js";
import { P as listUsers } from "./superadmin-Cn5Mt1aQ.js";
import { B as useNodesState, F as Handle$1, I as Position, L as ReactFlow, N as Background$1, P as Controls$1, R as addEdge, z as useEdgesState } from "./tms-BZu3d1fQ.js";
import { i as listRoles } from "./roles-CNnFlAEt.js";
//#region src/pages/CommandCenter/CommandPalette.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var CommandPalette = ({ isOpen, onClose }) => {
	const [search, setSearch] = (0, import_react.useState)("");
	const [selectedIndex, setSelectedIndex] = (0, import_react.useState)(0);
	const filteredCommands = [
		{
			id: "audit",
			icon: faShieldHalved,
			label: "Run System Audit",
			category: "System",
			shortcut: "⌥ A"
		},
		{
			id: "users",
			icon: faUsers,
			label: "Manage Personnel",
			category: "HRMS",
			shortcut: "⌥ U"
		},
		{
			id: "reports",
			icon: faChartLine,
			label: "Generate KPI Report",
			category: "Analytics",
			shortcut: "⌥ R"
		},
		{
			id: "deploy",
			icon: faBolt,
			label: "Trigger Automation Workflow",
			category: "Automation",
			shortcut: "⌥ D"
		},
		{
			id: "settings",
			icon: faGear,
			label: "System Configuration",
			category: "Admin",
			shortcut: "⌥ S"
		},
		{
			id: "help",
			icon: faLifeRing,
			label: "Open Command Center Help",
			category: "Support",
			shortcut: "⌥ H"
		}
	].filter((cmd) => cmd.label.toLowerCase().includes(search.toLowerCase()) || cmd.category.toLowerCase().includes(search.toLowerCase()));
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				onClose(!isOpen);
			}
			if (!isOpen) return;
			if (e.key === "Escape") onClose(false);
			if (e.key === "ArrowDown") setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
			if (e.key === "ArrowUp") setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
			if (e.key === "Enter") {
				console.log("Executing command:", filteredCommands[selectedIndex]);
				onClose(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isOpen,
		onClose,
		filteredCommands,
		selectedIndex
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "command-palette-overlay",
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 1e4,
			display: "flex",
			alignItems: "flex-start",
			justifyContent: "center",
			paddingTop: "15vh",
			background: "rgba(0,0,0,0.4)",
			backdropFilter: "blur(8px)"
		},
		onClick: () => onClose(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				scale: .95,
				y: -20
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				scale: .95,
				y: -20
			},
			className: "command-palette-container",
			style: {
				width: "100%",
				maxWidth: "600px",
				background: "#1e293b",
				borderRadius: "16px",
				overflow: "hidden",
				boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
				border: "1px solid rgba(255,255,255,0.1)"
			},
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-bottom border-white border-opacity-10 d-flex align-items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faSearch,
							className: "text-muted fs-5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							type: "text",
							className: "bg-transparent border-0 text-white w-100 fs-5 outline-none",
							placeholder: "Type a command or search...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							style: { outline: "none" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "badge bg-white bg-opacity-10 text-white px-2 py-1 rounded small fw-bold",
							children: "ESC"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "command-list py-2",
					style: {
						maxHeight: "400px",
						overflowY: "auto"
					},
					children: [filteredCommands.map((cmd, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `px-4 py-3 d-flex align-items-center justify-content-between cursor-pointer transition-all ${idx === selectedIndex ? "bg-primary bg-opacity-25 text-white" : "text-white-50 hover-bg-white hover-bg-opacity-5"}`,
						onMouseEnter: () => setSelectedIndex(idx),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `rounded-3 d-flex align-items-center justify-content-center ${idx === selectedIndex ? "text-primary" : "text-white"}`,
								style: {
									width: "32px",
									height: "32px",
									background: "rgba(255,255,255,0.05)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: cmd.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold small text-white",
								children: cmd.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "x-small opacity-50 text-white",
								children: cmd.category
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "x-small fw-bold opacity-30",
							children: cmd.shortcut
						})]
					}, cmd.id)), filteredCommands.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-5 text-center text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faMicrochip,
							className: "fs-1 mb-3 opacity-20"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-0",
							children: [
								"No commands found for \"",
								search,
								"\""
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 bg-black bg-opacity-20 border-top border-white border-opacity-10 d-flex justify-content-between align-items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "x-small text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faKeyboard,
								className: "me-1 text-white"
							}), " Use arrows to navigate"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "x-small text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faBolt,
								className: "me-1 text-white"
							}), " Press enter to execute"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "x-small text-white",
						children: "Enterprise Command Center v4.2"
					})]
				})
			]
		})
	}) });
};
//#endregion
//#region src/pages/CommandCenter/OrgNavigator.jsx
var CustomNode = ({ data }) => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const colorStyle = data.color.startsWith("#") ? {
		backgroundColor: `${data.color}15`,
		color: data.color,
		border: `1px solid ${data.color}30`
	} : {};
	const colorClass = data.color.startsWith("#") ? "" : `bg-${data.color} bg-opacity-10 text-${data.color}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-3 rounded-4 shadow-lg border ${isDark ? "bg-dark-card border-white border-opacity-10 text-white" : "bg-white border-gray-200"}`,
		style: { minWidth: "170px" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle$1, {
				type: "target",
				position: Position.Top,
				style: {
					background: data.color.startsWith("#") ? data.color : "#6366f1",
					border: "none",
					width: "8px",
					height: "8px"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `p-2 rounded-3 d-flex align-items-center justify-content-center ${colorClass}`,
					style: {
						...colorStyle,
						width: "36px",
						height: "36px"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: data.icon })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "fw-black x-small text-uppercase opacity-50",
						style: {
							fontSize: "9px",
							letterSpacing: "0.5px"
						},
						children: data.type
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "fw-bold small text-truncate",
						style: { maxWidth: "105px" },
						title: data.label,
						children: data.label
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle$1, {
				type: "source",
				position: Position.Bottom,
				style: {
					background: data.color.startsWith("#") ? data.color : "#6366f1",
					border: "none",
					width: "8px",
					height: "8px"
				}
			})
		]
	});
};
var nodeTypes = { custom: CustomNode };
var iconMap = {
	FiShield: faShield,
	FiUser: faUser,
	FiStar: faStar,
	FiBriefcase: faBriefcase,
	FiCode: faCode,
	FiCpu: faMicrochip,
	FiSettings: faSitemap,
	FiZap: faAward,
	FiAward: faAward,
	FiCommand: faSitemap,
	FiGlobe: faGlobe,
	FiKey: faKey,
	faBuilding,
	faUsers
};
var defaultRoles = [
	{
		id: "role-2",
		name: "Administrator",
		level: 1,
		color: "#10b981",
		icon: "FiSettings"
	},
	{
		id: "role-3",
		name: "Department Head",
		level: 2,
		color: "#f59e0b",
		icon: "FiBriefcase"
	},
	{
		id: "role-4",
		name: "Senior Engineer",
		level: 3,
		color: "#06b6d4",
		icon: "FiCode"
	},
	{
		id: "role-5",
		name: "Support Agent",
		level: 4,
		color: "#ec4899",
		icon: "FiUser"
	}
];
var OrgNavigator = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const onConnect = (0, import_react.useCallback)((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		const loadRolesData = async () => {
			setLoading(true);
			try {
				const rolesData = await listRoles();
				if (!isMounted) return;
				const activeRoles = rolesData && rolesData.length > 0 ? rolesData.filter((r) => r.status && ![
					"superadmin",
					"super admin",
					"super_admin",
					"root super admin"
				].includes(String(r.name || "").trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " "))) : defaultRoles;
				const finalRoles = activeRoles.length > 0 ? activeRoles : defaultRoles;
				const rolesByLevel = {};
				finalRoles.forEach((role) => {
					const level = role.level || 1;
					if (!rolesByLevel[level]) rolesByLevel[level] = [];
					rolesByLevel[level].push(role);
				});
				const sortedLevels = Object.keys(rolesByLevel).map(Number).sort((a, b) => a - b);
				const flowNodes = [];
				const flowEdges = [];
				sortedLevels.forEach((level, levelIdx) => {
					const rolesAtLevel = rolesByLevel[level];
					const count = rolesAtLevel.length;
					const yPos = levelIdx * 135 + 40;
					rolesAtLevel.forEach((role, idx) => {
						const spacing = 220;
						const xPos = 250 - (count - 1) * spacing / 2 + idx * spacing;
						flowNodes.push({
							id: String(role.id),
							type: "custom",
							position: {
								x: xPos,
								y: yPos
							},
							data: {
								label: role.name,
								type: `Level ${level}`,
								icon: iconMap[role.icon] || faShield,
								color: role.color || "#4f46e5"
							}
						});
					});
					if (levelIdx < sortedLevels.length - 1) {
						const nextLevel = sortedLevels[levelIdx + 1];
						const currentRoles = rolesByLevel[level];
						const nextRoles = rolesByLevel[nextLevel];
						currentRoles.forEach((currRole) => {
							nextRoles.forEach((nextRole) => {
								flowEdges.push({
									id: `e-${currRole.id}-${nextRole.id}`,
									source: String(currRole.id),
									target: String(nextRole.id),
									animated: true,
									style: {
										stroke: currRole.color || "#4f46e5",
										strokeWidth: 1.5,
										opacity: .6
									}
								});
							});
						});
					}
				});
				setNodes(flowNodes);
				setEdges(flowEdges);
			} catch (err) {
				console.error("Failed to load roles hierarchy in OrgNavigator:", err);
			} finally {
				if (isMounted) setLoading(false);
			}
		};
		loadRolesData();
		return () => {
			isMounted = false;
		};
	}, [setNodes, setEdges]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			height: "450px",
			width: "100%",
			background: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
			borderRadius: "24px",
			overflow: "hidden",
			position: "relative"
		},
		children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "position-absolute top-50 start-50 translate-middle text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: faSpinner,
				spin: true,
				size: "2xl",
				className: "text-primary mb-2"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "small text-muted",
				children: "Building Roles Hierarchy Chart..."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ReactFlow, {
			nodes,
			edges,
			onNodesChange,
			onEdgesChange,
			onConnect,
			nodeTypes,
			fitView: true,
			minZoom: .5,
			maxZoom: 1.5,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Background$1, {
				color: isDark ? "#333" : "#ccc",
				gap: 20
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controls$1, {})]
		})
	});
};
//#endregion
//#region src/pages/CommandCenter/WorkspaceLauncher.jsx
var ICON_MAP = {
	faUsers,
	faProjectDiagram,
	faTasks,
	faFileAlt,
	faHandshake,
	faWallet,
	faHeadset,
	faTools,
	faBoxes,
	faIndustry,
	faDollarSign,
	faBrain
};
var MODULE_TAB_MAP = {
	HRMS: "hrms_overview",
	PMS: "pms_overview",
	TMS: "tms_dashboard",
	DMS: "dms_dashboard",
	CRM: "crm_overview",
	FMS: "fms_overview",
	ASST: "asst_overview",
	INV: "inv_overview",
	MFG: "mfg_overview",
	FX: "fx_overview",
	AI: "ai_overview"
};
var WorkspaceLauncher = ({ isDark }) => {
	const { setSystemContext, setActiveModule, setActiveTab } = useApp();
	const [modules, setModules] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		getSystemModules().then((res) => {
			setModules(Array.isArray(res.data) ? res.data : []);
		}).catch(() => {
			setModules([]);
		}).finally(() => setLoading(false));
	}, []);
	const handleLaunch = (mod) => {
		if (mod.status === "In Building" || mod.status === "--") return;
		const sysId = mod.code.toLowerCase();
		setSystemContext(sysId);
		setActiveModule(sysId);
		setActiveTab(MODULE_TAB_MAP[mod.code] || `${sysId}_overview`);
	};
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: .04 }
		}
	};
	const itemVariants = {
		hidden: {
			x: -10,
			opacity: 0
		},
		visible: {
			x: 0,
			opacity: 1
		}
	};
	const displayModules = loading ? Array.from({ length: 9 }, (_, i) => ({
		code: "...",
		name: "Loading...",
		icon: "faTools",
		color: "#6b7280",
		status: "--",
		uptime: "--",
		_skeleton: true
	})) : modules;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		variants: containerVariants,
		initial: "hidden",
		animate: "visible",
		className: "row g-4",
		children: [displayModules.map((mod, i) => {
			const isDisabled = mod.status === "In Building" || mod._skeleton;
			const IconComponent = ICON_MAP[mod.icon] || faTools;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-12 col-md-6 col-xl-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					variants: itemVariants,
					whileHover: isDisabled ? {} : {
						y: -4,
						boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(79, 70, 229, 0.08)"
					},
					onClick: () => !isDisabled && handleLaunch(mod),
					className: `card border-0 shadow-sm h-100 overflow-hidden position-relative ${isDisabled ? "" : "cursor-pointer group"} ${isDark ? "bg-dark-card" : "bg-white"}`,
					style: {
						borderRadius: "20px",
						border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
						background: isDark ? "linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))" : "#ffffff",
						...isDisabled ? {
							opacity: .55,
							filter: "grayscale(0.5)",
							cursor: "not-allowed"
						} : {}
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-body p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex-shrink-0 rounded-4 d-flex align-items-center justify-content-center transition-all ${isDisabled ? "" : "group-hover-scale"}`,
								style: {
									width: "64px",
									height: "64px",
									background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
									border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.03)",
									color: isDisabled ? "#adb5bd" : mod.color
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: IconComponent,
									className: "fs-3"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-grow-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center justify-content-between mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `fw-black text-uppercase letter-spacing-wider ${isDark ? "text-white-50" : "text-muted"}`,
											style: { fontSize: "0.65rem" },
											children: [mod.code, " SUBSYSTEM"]
										}), !isDisabled && mod.uptime && mod.uptime !== "--" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faCircle,
												className: "text-success x-small animate-pulse",
												style: { fontSize: "6px" }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "x-small fw-bold text-success",
												style: { fontSize: "0.6rem" },
												children: mod.uptime
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: `fw-black mb-1 ${isDark ? "text-white" : "text-dark"}`,
										style: { letterSpacing: "-0.02em" },
										children: mod.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-3 mt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `badge rounded-pill px-2 py-1 fw-bold ${isDisabled ? "bg-warning-subtle text-warning" : isDark ? "bg-white bg-opacity-5 text-white-50" : "bg-light text-muted"}`,
											style: { fontSize: "0.6rem" },
											children: mod.status
										}), !isDisabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "ms-auto opacity-0 group-hover-opacity-100 transition-all transform group-hover-translate-x",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "x-small fw-black text-primary me-2",
												children: "LAUNCH"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faChevronRight,
												className: "text-primary x-small"
											})]
										})]
									})
								]
							})]
						})
					}), !isDisabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "position-absolute bottom-0 start-0 h-100 w-1 transition-all opacity-0 group-hover-opacity-100",
						style: {
							width: "4px",
							background: mod.color
						}
					})]
				})
			}, mod.code + i);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				variants: itemVariants,
				whileHover: { y: -2 },
				className: `card border-0 shadow-sm overflow-hidden group cursor-pointer bg-opacity-50 ${isDark ? "bg-primary bg-opacity-10" : "bg-primary bg-opacity-50"}`,
				style: {
					borderRadius: "20px",
					border: "1px dashed rgba(79, 70, 229, 0.3)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4 d-flex align-items-center justify-content-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-lg",
							style: {
								width: "48px",
								height: "48px"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faThLarge })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
							className: `fw-black mb-0 bold ${isDark ? "text-white" : "text-dark"}`,
							children: "Global Module Directory"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "x-small text-muted mb-0 fw-bold",
							children: "Access the full enterprise application landscape"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-pill px-4 fw-black shadow-sm d-flex align-items-center gap-2",
						onClick: () => setActiveTab("systems-hub"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore All Modules" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faChevronRight,
							className: "small"
						})]
					})]
				})
			})
		})]
	});
};
//#endregion
//#region src/pages/CommandCenter/AutomationControl.jsx
var AutomationControl = ({ isDark }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card border-0 shadow-sm overflow-hidden",
		style: {
			borderRadius: "24px",
			background: isDark ? "rgba(15, 23, 42, 0.4)" : "white",
			height: "500px"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
				className: `fw-black mb-0 ${isDark ? "text-white" : "text-dark"}`,
				children: "Automation Control"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn btn-sm btn-light-primary rounded-pill px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faSync,
					className: "me-1"
				}), " Refresh"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-body p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4 overflow-y-auto custom-work-queue-scroll",
				style: { maxHeight: "325px" },
				children: [
					{
						name: "Daily Backup Sync",
						status: "Running",
						health: 98,
						lastRun: "2h ago",
						color: "success"
					},
					{
						name: "Payroll Processing",
						status: "Idle",
						health: 100,
						lastRun: "1d ago",
						color: "primary"
					},
					{
						name: "Asset Auto-Discovery",
						status: "Warning",
						health: 65,
						lastRun: "10m ago",
						color: "warning"
					},
					{
						name: "CRM Data Scrubbing",
						status: "Paused",
						health: 100,
						lastRun: "3h ago",
						color: "secondary"
					}
				].map((auto) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `p-3 rounded-4 border ${isDark ? "border-white border-opacity-10" : "border-light"} transition-all hover-lift`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-center mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `rounded-circle pulse-dot bg-${auto.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `fw-bold small ${isDark ? "text-white" : "text-dark"}`,
								children: auto.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "x-small text-muted",
								children: [
									auto.status,
									" · Last run ",
									auto.lastRun
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-xs btn-light-primary rounded-circle",
								style: {
									width: "28px",
									height: "28px",
									padding: 0
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: auto.status === "Running" ? faPause : faPlay,
									className: "x-small"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-xs btn-light-danger rounded-circle",
								style: {
									width: "28px",
									height: "28px",
									padding: 0
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faStop,
									className: "x-small"
								})
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-grow-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "progress",
								style: {
									height: "6px",
									borderRadius: "10px"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `progress-bar bg-${auto.color}`,
									style: { width: `${auto.health}%` }
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `fw-bold x-small ${auto.health < 80 ? "text-danger" : "text-success"}`,
							children: [auto.health, "% Health"]
						})]
					})]
				}, auto.name))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn btn-primary w-100 rounded-pill mt-4 fw-bold py-2 shadow-sm",
				children: "Enter Workflow Designer"
			})]
		})]
	});
};
//#endregion
//#region src/pages/CommandCenter/UnifiedWorkQueue.jsx
var UnifiedWorkQueue = ({ isDark }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `card border-0 shadow-sm h-100 overflow-hidden ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
		style: {
			borderRadius: "24px",
			border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-2 mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-primary bg-opacity-10 p-2 rounded-3 text-primary shadow-sm",
						style: {
							width: "32px",
							height: "32px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faInbox,
							className: "small"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "x-small fw-black text-primary letter-spacing-wider text-uppercase",
						children: "Priority Stream"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: `fw-black mb-0 ${isDark ? "text-white" : "text-dark"}`,
					children: "Unified Work Queue"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex gap-2 mb-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `btn btn-sm rounded-pill px-3 fw-bold border ${isDark ? "btn-outline-light border-opacity-10" : "btn-outline-primary border-opacity-20"}`,
						style: { fontSize: "0.7rem" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faFilter,
							className: "me-2"
						}), " Filter"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "custom-work-queue-scroll pe-2",
					style: {
						maxHeight: "200px",
						overflowY: "auto",
						overflowX: "hidden"
					},
					children: [
						{
							id: 1,
							system: "HRMS",
							task: "Review Leave Application",
							priority: "High",
							due: "2h",
							color: "#4f46e5",
							user: "Sarah Jenkins"
						},
						{
							id: 2,
							system: "PMS",
							task: "Milestone Approval Required",
							priority: "Medium",
							due: "5h",
							color: "#10b981",
							user: "Project Alpha"
						},
						{
							id: 3,
							system: "FMS",
							task: "Audit Report Discrepancy",
							priority: "Critical",
							due: "30m",
							color: "#ef4444",
							user: "Finance Dept"
						},
						{
							id: 4,
							system: "CRM",
							task: "Follow up with Enterprise Lead",
							priority: "Low",
							due: "1d",
							color: "#f59e0b",
							user: "Microsoft Corp"
						},
						{
							id: 5,
							system: "DMS",
							task: "Renew System Certificates",
							priority: "Medium",
							due: "12h",
							color: "#3b82f6",
							user: "IT Infrastructure"
						},
						{
							id: 6,
							system: "TMS",
							task: "Task Dependency Conflict",
							priority: "High",
							due: "1h",
							color: "#8b5cf6",
							user: "Dev Team"
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							x: -10
						},
						animate: {
							opacity: 1,
							x: 0
						},
						whileHover: { x: 4 },
						className: `p-3 mb-3 rounded-4 border transition-all cursor-pointer group position-relative ${isDark ? "border-white border-opacity-5 bg-white bg-opacity-5 hover-bg-opacity-10" : "border-light bg-light bg-opacity-50 hover-bg-white shadow-hover"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-start justify-content-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-circle mt-1 d-flex align-items-center justify-content-center flex-shrink-0",
									style: {
										width: "8px",
										height: "8px",
										background: item.color,
										boxShadow: `0 0 10px ${item.color}80`
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2 mb-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `fw-black x-small text-uppercase opacity-50 ${isDark ? "text-white" : "text-dark"}`,
												children: item.system
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted x-small opacity-50",
												children: "•"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted x-small fw-bold",
												children: item.user
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `fw-bold mb-2 ${isDark ? "text-white" : "text-dark"}`,
										style: { fontSize: "0.9rem" },
										children: item.task
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-1 x-small text-muted fw-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faClock,
												className: "x-small opacity-50"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.due, " left"] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "badge rounded-pill fw-black text-uppercase",
											style: {
												fontSize: "0.55rem",
												background: item.priority === "Critical" ? "#ef444420" : item.priority === "High" ? "#f59e0b20" : "#10b98120",
												color: item.priority === "Critical" ? "#ef4444" : item.priority === "High" ? "#f59e0b" : "#10b981",
												border: `1px solid ${item.priority === "Critical" ? "#ef444430" : item.priority === "High" ? "#f59e0b30" : "#10b98130"}`
											},
											children: item.priority
										})]
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "opacity-0 group-hover-opacity-100 transition-all",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `btn btn-xs rounded-circle ${isDark ? "btn-outline-light" : "btn-outline-primary"}`,
									style: {
										width: "28px",
										height: "28px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faChevronRight,
										className: "x-small"
									})
								})
							})]
						})
					}, item.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 pt-2 border-top border-primary border-opacity-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary w-100 rounded-pill fw-black py-2 shadow-sm d-flex align-items-center justify-content-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Execute All Tasks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faSortAmountDown,
							className: "small"
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
                .custom-work-queue-scroll::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-work-queue-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-work-queue-scroll::-webkit-scrollbar-thumb {
                    background: ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"};
                    border-radius: 10px;
                    transition: all 0.3s;
                }
                .custom-work-queue-scroll::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"};
                }
                .shadow-hover:hover {
                    box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05);
                }
                .letter-spacing-wider {
                    letter-spacing: 0.1em;
                }
            ` })
		]
	});
};
//#endregion
//#region src/pages/CommandCenter/ExecutiveBriefing.jsx
var ExecutiveBriefing = ({ isDark }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 rounded-5 shadow-2xl overflow-hidden position-relative ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white border-light"}`,
		style: { border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "position-absolute top-0 end-0 p-4 opacity-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faGlobe,
					style: { fontSize: "10rem" }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center justify-content-between mb-4 position-relative z-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-4 bg-danger bg-opacity-10 p-2 text-danger animate-pulse",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTowerBroadcast })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
						className: `fw-black mb-0 ${isDark ? "text-white" : "text-dark"}`,
						children: "Live Executive Briefing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
						className: "text-muted fw-bold x-small",
						children: "Mission Control Data Stream"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-2 bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill x-small fw-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pulse-dot bg-success" }), " ONLINE"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4 position-relative z-1",
				children: [
					{
						type: "Critical",
						msg: "System Latency Spike in EU-West Cluster",
						icon: faExclamationTriangle,
						color: "danger"
					},
					{
						type: "Notice",
						msg: "Governance Audit Completed (98% Pass)",
						icon: faShieldAlt,
						color: "success"
					},
					{
						type: "Update",
						msg: "New Workforce Policy Deployed via HRMS",
						icon: faUserCheck,
						color: "primary"
					}
				].map((alert, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						x: -20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { delay: i * .1 },
					className: `p-3 my-2 rounded-4 d-flex align-items-center gap-3 ${isDark ? "bg-white bg-opacity-5" : "bg-light"} border ${isDark ? "border-white border-opacity-10" : "border-gray-200"} shadow-sm`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `rounded-circle p-2 text-${alert.color} bg-${alert.color} bg-opacity-10 x-small`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: alert.icon })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-grow-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `fw-black x-small text-uppercase text-${alert.color}`,
							style: { letterSpacing: "0.05em" },
							children: alert.type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `small fw-bold ${isDark ? "text-white" : "text-dark"}`,
							children: alert.msg
						})]
					})]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 pt-3 border-top border-white border-opacity-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-4 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted x-small fw-bold text-uppercase mb-1",
								children: "Global Health"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h4 fw-black text-success mb-0",
								children: "99.4%"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-4 text-center border-start border-end border-white border-opacity-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted x-small fw-bold text-uppercase mb-1",
								children: "Risk Score"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h4 fw-black text-warning mb-0",
								children: "12.8"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-4 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted x-small fw-bold text-uppercase mb-1",
								children: "Compliance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h4 fw-black text-primary mb-0",
								children: "97%"
							})]
						})
					]
				})
			})
		]
	});
};
//#endregion
//#region src/pages/CommandCenter/EmergencyOps.jsx
var EmergencyOps = ({ isDark }) => {
	const [defcon, setDefcon] = (0, import_react.useState)(5);
	const [isEmergency, setIsEmergency] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 rounded-5 overflow-hidden position-relative ${isDark ? "bg-dark-card border-danger border-opacity-20" : "bg-white border-danger border-opacity-10"}`,
		style: { border: "2px solid" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center justify-content-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `p-2 rounded-3 ${isEmergency ? "bg-danger text-white animate-pulse" : "bg-danger bg-opacity-10 text-danger"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faRadiation })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
						className: `fw-black mb-0 ${isDark ? "text-white" : "text-dark"}`,
						children: "Emergency Operations Center"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
						className: "text-muted fw-bold x-small",
						children: "EOC System Status"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "badge bg-danger text-white px-3 py-1 rounded-pill x-small fw-black",
					children: ["DEFCON ", defcon]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						name: "Core API",
						status: "Optimal",
						load: "12%",
						color: "success"
					},
					{
						name: "Data Shard A",
						status: "Optimal",
						load: "45%",
						color: "success"
					},
					{
						name: "Identity Provider",
						status: "Warning",
						load: "88%",
						color: "warning"
					},
					{
						name: "Storage Cluster",
						status: "Optimal",
						load: "5%",
						color: "success"
					}
				].map((sys) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `p-2 rounded-3 ${isDark ? "bg-white bg-opacity-5" : "bg-light"} border-start border-4 border-${sys.color}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "x-small text-muted fw-bold text-uppercase",
								children: sys.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `small fw-black ${isDark ? "text-white" : "text-dark"}`,
								children: sys.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "progress mt-1",
								style: { height: "4px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `progress-bar bg-${sys.color}`,
									style: { width: sys.load }
								})
							})
						]
					})
				}, sys.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex gap-2 mt-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: `btn btn-sm flex-grow-1 rounded-pill fw-black ${isEmergency ? "btn-danger" : "btn-outline-danger"}`,
					onClick: () => setIsEmergency(!isEmergency),
					children: isEmergency ? "ABORT EMERGENCY" : "DECLARE EMERGENCY"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: `btn btn-sm btn-dark rounded-pill px-3`,
					onClick: () => setDefcon((prev) => prev > 1 ? prev - 1 : 5),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExclamationCircle })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isEmergency && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				className: "position-absolute top-0 start-0 w-100 h-100 bg-danger bg-opacity-10 d-flex align-items-center justify-content-center pointer-events-none",
				style: { zIndex: 0 },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "display-1 opacity-10 fw-black rotate-12",
					children: "EMERGENCY"
				})
			}) })
		]
	});
};
//#endregion
//#region src/data/dashboardWidgetRegistry.js
var DASHBOARD_WIDGET_PREFERENCES_KEY = "dashboardWidgets";
var dashboardWidgetRegistry = [
	{
		id: "fms-dashboard",
		module: "fms",
		label: "FMS dashboard",
		description: "Financial health, balances, revenue, expenses, and recent transactions.",
		icon: faCoins,
		color: "success",
		tab: "fms_overview",
		defaultVisible: true
	},
	{
		id: "ams-dashboard",
		module: "ams",
		label: "AMS dashboard",
		description: "Accounting KPIs, receivables, cash flow, invoices, and close controls.",
		icon: faChartLine,
		color: "primary",
		tab: "erp_dashboard",
		defaultVisible: true
	},
	{
		id: "hrms-dashboard",
		module: "hrms",
		label: "HRMS dashboard",
		description: "Workforce, attendance, compliance, departments, and employee activity.",
		icon: faPeopleGroup,
		color: "info",
		tab: "hrms_overview",
		defaultVisible: true
	},
	{
		id: "pms-dashboard",
		module: "pms",
		label: "PMS dashboard",
		description: "Project delivery health, open work, milestones, and portfolio activity.",
		icon: faProjectDiagram,
		color: "warning",
		tab: "pms_overview",
		defaultVisible: true
	}
];
var getDefaultDashboardWidgetIds = () => dashboardWidgetRegistry.filter((widget) => widget.defaultVisible).map((widget) => widget.id);
//#endregion
//#region src/hooks/useDashboardWidgets.js
var STORAGE_KEY = "manage_core_dashboard_widget_preferences";
var getUserKey = (user) => user?.id || user?.user_id || user?.email || "anonymous";
var normalizeIds = (ids) => {
	const validIds = new Set(dashboardWidgetRegistry.map((widget) => widget.id));
	return [...new Set((Array.isArray(ids) ? ids : []).filter((id) => validIds.has(id)))];
};
var readStoredIds = (userKey) => {
	try {
		const raw = localStorage.getItem(`${STORAGE_KEY}:${userKey}`);
		return raw === null ? null : normalizeIds(JSON.parse(raw));
	} catch {
		return null;
	}
};
var writeStoredIds = (userKey, ids) => {
	try {
		localStorage.setItem(`${STORAGE_KEY}:${userKey}`, JSON.stringify(ids));
	} catch {}
};
var extractPreferenceIds = (response) => {
	const preferences = response?.data?.preferences || response?.preferences || response?.data || response;
	if (!preferences || !Object.prototype.hasOwnProperty.call(preferences, "dashboardWidgets")) return null;
	return normalizeIds(preferences[DASHBOARD_WIDGET_PREFERENCES_KEY]);
};
var useDashboardWidgets = (currentUser) => {
	const userKey = getUserKey(currentUser);
	const [visibleWidgetIds, setVisibleWidgetIds] = (0, import_react.useState)(() => {
		const stored = readStoredIds(userKey);
		return stored === null ? getDefaultDashboardWidgetIds() : stored;
	});
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const load = async () => {
			try {
				const ids = extractPreferenceIds(await getPreferences());
				if (!cancelled && ids !== null) {
					setVisibleWidgetIds(ids);
					writeStoredIds(userKey, ids);
				}
			} catch {}
		};
		load();
		return () => {
			cancelled = true;
		};
	}, [userKey]);
	const persist = (0, import_react.useCallback)(async (ids) => {
		const normalized = normalizeIds(ids);
		setVisibleWidgetIds(normalized);
		writeStoredIds(userKey, normalized);
		setIsSaving(true);
		try {
			const response = await getPreferences().catch(() => null);
			await updatePreferences({
				...response?.data?.preferences || response?.preferences || {},
				[DASHBOARD_WIDGET_PREFERENCES_KEY]: normalized
			});
		} catch {} finally {
			setIsSaving(false);
		}
	}, [userKey]);
	const toggleWidget = (0, import_react.useCallback)((widgetId) => {
		persist(visibleWidgetIds.includes(widgetId) ? visibleWidgetIds.filter((id) => id !== widgetId) : [...visibleWidgetIds, widgetId]);
	}, [persist, visibleWidgetIds]);
	const resetWidgets = (0, import_react.useCallback)(() => persist(getDefaultDashboardWidgetIds()), [persist]);
	return {
		widgets: dashboardWidgetRegistry,
		visibleWidgets: (0, import_react.useMemo)(() => dashboardWidgetRegistry.filter((widget) => visibleWidgetIds.includes(widget.id)), [visibleWidgetIds]),
		visibleWidgetIds,
		toggleWidget,
		resetWidgets,
		isSaving
	};
};
//#endregion
//#region src/components/dashboard/DashboardWidgetManager.jsx
var DashboardWidgetManager = ({ widgets, visibleWidgetIds, toggleWidget, resetWidgets, isSaving }) => {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "dropdown position-relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "btn btn-outline-primary btn-sm rounded-pill fw-semibold",
			onClick: () => setOpen((value) => !value),
			"aria-expanded": open,
			"aria-haspopup": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: faGear,
				className: "me-2"
			}), "Customize widgets"]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "dropdown-menu dropdown-menu-end show p-3 shadow-lg",
			style: {
				minWidth: 290,
				maxWidth: "calc(100vw - 32px)",
				right: 8,
				left: "auto",
				maxHeight: "min(70vh, 420px)",
				overflowY: "auto",
				zIndex: 1080
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center justify-content-between mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dashboard widgets" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn btn-link btn-sm p-0",
						onClick: resetWidgets,
						disabled: isSaving,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faRotateLeft,
							className: "me-1"
						}), "Reset"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted small mb-3",
					children: "Add or remove module dashboards from this workspace."
				}),
				widgets.map((widget) => {
					const selected = visibleWidgetIds.includes(widget.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "dropdown-item rounded-3 d-flex align-items-center gap-2 py-2",
						onClick: () => toggleWidget(widget.id),
						"aria-pressed": selected,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: widget.icon,
								className: `text-${widget.color}`,
								fixedWidth: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-grow-1 text-start",
								children: widget.label
							}),
							selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCheck,
								className: "text-success"
							})
						]
					}, widget.id);
				}),
				isSaving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-muted x-small mt-2",
					children: "Saving preferences…"
				})
			]
		})]
	});
};
//#endregion
//#region src/components/dashboard/DashboardModuleWidgets.jsx
var DashboardModuleWidgets = ({ widgets, onOpen, isDark }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
	className: "mb-5",
	"aria-label": "Module dashboard widgets",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "d-flex align-items-center justify-content-between mb-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
			className: `fw-black mb-1 ${isDark ? "text-white" : "text-dark"}`,
			children: "Module dashboards"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted small mb-0",
			children: "Your selected FMS, AMS, HRMS, and PMS workspaces."
		})] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "row g-4",
		children: widgets.map((widget) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-xl-3 col-md-6",
			"data-testid": `dashboard-widget-${widget.id}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `card border-0 shadow-sm rounded-4 h-100 w-100 text-start ${isDark ? "bg-dark-card" : "bg-white"}`,
				onClick: () => onOpen(widget.tab),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `p-3 rounded-4 bg-${widget.color} bg-opacity-10 text-${widget.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: widget.icon,
									size: "lg"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faArrowRight,
								className: "text-muted"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
							className: `fw-bold mb-2 ${isDark ? "text-white" : "text-dark"}`,
							children: widget.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted small mb-0",
							children: widget.description
						})
					]
				})
			})
		}, widget.id))
	})]
});
//#endregion
//#region src/pages/overview/AdminDashboard.jsx
var StatCard = ({ title, value, subValue, icon, color, progress }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "card border-0 shadow-sm h-100 overflow-hidden",
	style: { borderRadius: "16px" },
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-body p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `rounded-circle bg-${color}-subtle d-flex align-items-center justify-content-center`,
					style: {
						width: "48px",
						height: "48px"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon,
						className: `text-${color} fs-5`
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "dropdown",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-link text-muted p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faSync,
							className: "small"
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "fw-bold mb-1",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted small fw-semibold mb-3",
				children: title
			}),
			progress !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
						className: "text-muted",
						style: { fontSize: "0.7rem" },
						children: subValue
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
						className: "fw-bold text-dark",
						style: { fontSize: "0.7rem" },
						children: [progress, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "progress",
					style: {
						height: "6px",
						borderRadius: "10px"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `progress-bar bg-${color}`,
						style: { width: `${progress}%` }
					})
				})]
			})
		]
	})
});
var ShortcutButton = ({ label, icon, color, onClick, description, t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "card border-0 shadow-sm transition-all hover-lift-lg cursor-pointer h-100 overflow-hidden group",
	style: {
		borderRadius: "24px",
		background: "rgba(255, 255, 255, 0.85)",
		backdropFilter: "blur(16px)",
		border: "1px solid rgba(255, 255, 255, 0.5)",
		boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
		position: "relative"
	},
	onClick,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "position-absolute top-0 start-0 w-100 h-100 opacity-0 group-hover-shine transition-all pointer-events-none z-0",
			style: {
				background: "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)",
				width: "200%",
				transform: "translateX(-100%) skewX(-15deg)"
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-body p-4 d-flex flex-column align-items-center text-center position-relative z-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `position-absolute top-0 end-0 p-3 opacity-10 transition-all group-hover-scale-rotate z-n1`,
					style: {
						fontSize: "5.5rem",
						transform: "translate(25%, -25%) rotate(-10deg)",
						filter: "blur(3px)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon,
						className: `text-${color}`
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `rounded-circle d-flex align-items-center justify-content-center mb-4 shadow-sm transition-all group-hover-bounce`,
					style: {
						width: "72px",
						height: "72px",
						background: `linear-gradient(135deg, var(--bs-${color}), rgba(var(--bs-${color}-rgb), 0.7))`,
						boxShadow: `0 8px 20px -5px rgba(var(--bs-${color}-rgb), 0.4)`
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon,
						className: `text-white fs-3`
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
					className: "fw-bold mb-2 text-dark",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted small mb-4 px-2",
					style: {
						fontSize: "0.85rem",
						lineHeight: "1.5",
						opacity: .8
					},
					children: description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `mt-auto btn btn-sm btn-${color} rounded-pill px-4 py-2 fw-bold shadow-sm transition-all group-hover-width d-flex align-items-center gap-2`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "white" },
						children: t("Explore")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faArrowRight,
						className: "small transition-all group-hover-translate-x text-white"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `position-absolute bottom-0 start-0 w-100 transition-all opacity-0 group-hover-opacity-100 bg-${color}`,
			style: {
				height: "5px",
				boxShadow: `0 -5px 15px rgba(var(--bs-${color}-rgb), 0.3)`
			}
		})
	]
});
var AdminOverview = () => {
	const { setActiveTab, currentUser, themeStyle, theme } = useApp();
	const { t } = useTranslation();
	const [userCount, setUserCount] = (0, import_react.useState)(0);
	const [roleCount, setRoleCount] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isCommandPaletteOpen, setIsCommandPaletteOpen] = (0, import_react.useState)(false);
	const { widgets, visibleWidgets, visibleWidgetIds, toggleWidget, resetWidgets, isSaving } = useDashboardWidgets(currentUser);
	const isDark = theme === "dark";
	const themeClass = themeStyle === "glassmorphism" ? "glass-dashboard-content" : "";
	(0, import_react.useEffect)(() => {
		async function fetchData() {
			try {
				const [users, roles] = await Promise.all([listUsers(), listRoles()]);
				setUserCount(users.length);
				setRoleCount(roles.length);
			} catch (err) {
				console.error("Error fetching admin stats", err);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);
	const systems = [
		{
			name: `PMS (${t("project_mgmt")})`,
			status: "Active",
			load: 45
		},
		{
			name: `HRMS (${t("human_resource")})`,
			status: "Active",
			load: 28
		},
		{
			name: `FMS (${t("finance_mgmt")})`,
			status: "Active",
			load: 12
		},
		{
			name: `TMS (${t("task_management")})`,
			status: "Active",
			load: 62
		},
		{
			name: `DMS (${t("document_management")})`,
			status: "Active",
			load: 34
		},
		{
			name: `CRM (${t("customer_relationship")})`,
			status: "In Building",
			load: 0
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid px-4 py-4 ${themeClass} ${isDark ? "dark-mode" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {
				isOpen: isCommandPaletteOpen,
				onClose: setIsCommandPaletteOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 rounded-5 mb-5 overflow-hidden shadow-2xl position-relative ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
				style: { border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "position-absolute top-0 start-0 w-100 h-100 z-0 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "position-absolute top-0 end-0 opacity-20 blur-4xl animated-blob",
						style: {
							width: "800px",
							height: "800px",
							borderRadius: "50%",
							background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
							transform: "translate(30%, -30%)"
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "position-absolute bottom-0 start-0 opacity-15 blur-4xl animated-blob animation-delay-2000",
						style: {
							width: "600px",
							height: "600px",
							borderRadius: "50%",
							background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
							transform: "translate(-20%, 20%)"
						}
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-body p-0 position-relative z-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 p-lg-5 h-100 d-flex flex-column justify-content-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-3 mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-circle bg-primary d-flex align-items-center justify-content-center shadow-lg hover-scale transition-all",
											style: {
												width: "56px",
												height: "56px",
												background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faLayerGroup,
												className: "text-white fs-4"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `badge ${isDark ? "bg-white bg-opacity-10 text-white" : "bg-primary bg-opacity-10 text-primary"} rounded-pill px-3 py-2 fw-black small text-uppercase letter-spacing-wider border ${isDark ? "border-white border-opacity-10" : "border-primary border-opacity-10"} backdrop-blur-md`,
											children: [t("enterprise_command_center"), " v4.2"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `x-small ${isDark ? "text-white-50" : "text-muted"} mt-1 fw-bold opacity-75`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faShieldHalved,
													className: "me-1"
												}),
												" ",
												t("authorized_admin_node")
											]
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: `display-3 fw-black mb-3 ls-tight ${isDark ? "text-white" : "text-dark"}`,
										style: { letterSpacing: "-0.04em" },
										children: [
											t("welcome_back"),
											", ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gradient-primary",
												children: currentUser?.name || t("admin")
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `lead ${isDark ? "text-white-50" : "text-muted"} mb-5 opacity-80 pe-xl-5 fw-medium`,
										children: t("admin_dashboard_desc")
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
											}), t("user_directory")]
										})]
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-4 d-none d-xl-block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 p-xl-5 h-100 bg-gradient-dark-blue d-flex align-items-center justify-content-center rounded-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 p-xl-5 rounded-5 backdrop-blur-xl border border-white border-opacity-10 shadow-3xl text-white w-100 transition hover-lift position-relative overflow-hidden ",
									style: { background: "rgba(15, 23, 42, 0.75)" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "position-absolute top-0 end-0 p-4 opacity-5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faMicrochip,
												style: {
													fontSize: "10rem",
													opacity: .3
												}
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex justify-content-between align-items-center mb-5 position-relative z-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
												className: "fw-black mb-0",
												children: t("system_health")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
															children: t("cpu_utilization")
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
															className: "progress-bar progress-bar-striped progress-bar-animated bg-info",
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
													children: t("infrastructure_logs")
												})
											]
										})
									]
								})
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-column gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-end justify-content-between mb-4 pb-2 border-bottom border-primary border-opacity-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
									className: `fw-black mb-1 d-flex align-items-center gap-3 ${isDark ? "text-white" : "text-dark"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-primary bg-opacity-10 p-2 rounded-3 text-primary shadow-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faLayerGroup,
											className: "small"
										})
									}), "Enterprise Workspace Launcher"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `x-small mb-0 fw-bold opacity-50 ${isDark ? "text-white" : "text-muted"}`,
									children: "ORCHESTRATE SYSTEM MODULES & SUBSYSTEMS"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex align-items-center gap-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-bold small border border-primary border-opacity-10 backdrop-blur-md",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faBolt,
											className: "me-2 x-small animate-pulse"
										}), "CTRL + K for Quick Search"]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex justify-content-end px-4 pb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardWidgetManager, {
									widgets,
									visibleWidgetIds,
									toggleWidget,
									resetWidgets,
									isSaving
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceLauncher, { isDark })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardModuleWidgets, {
						widgets: visibleWidgets,
						onOpen: setActiveTab,
						isDark
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveBriefing, { isDark })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnifiedWorkQueue, { isDark })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-xl-3 col-md-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									title: t("total_users"),
									value: loading ? "..." : userCount,
									subValue: t("user_limit"),
									icon: faUsers,
									color: "primary",
									progress: Math.min(userCount / 1e3 * 100, 100).toFixed(1),
									t
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-xl-3 col-md-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									title: t("active_roles"),
									value: loading ? "..." : roleCount,
									subValue: t("system_defined_roles"),
									icon: faUserTag,
									color: "success",
									progress: 75,
									t
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-xl-3 col-md-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									title: t("data_storage"),
									value: "4.2 GB",
									subValue: t("storage_limit"),
									icon: faDatabase,
									color: "info",
									progress: 42,
									t
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-xl-3 col-md-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									title: t("server_uptime"),
									value: "99.9%",
									subValue: t("status_optimal"),
									icon: faServer,
									color: "warning",
									progress: 99.9,
									t
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
								style: {
									borderRadius: "24px",
									border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card-body p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between align-items-center mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: `fw-black mb-0 ${isDark ? "text-white" : "text-dark"}`,
											children: "Organization Navigator"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge bg-info bg-opacity-10 text-info rounded-pill px-3 py-1 fw-bold small",
											children: "Real-time Mapping"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgNavigator, {})]
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutomationControl, { isDark })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-4 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `card border-0 shadow-sm h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
								style: {
									borderRadius: "24px",
									border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card-body p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between align-items-center mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: `fw-black mb-0 ${isDark ? "text-white" : "text-dark"}`,
											children: "Unified Work Queue"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm rounded-pill px-3 py-1 fw-bold shadow-sm",
											style: {
												backgroundColor: isDark ? "rgba(79, 70, 229, 0.15)" : "#eef2ff",
												color: "#4f46e5",
												border: "none",
												fontSize: "0.85rem"
											},
											children: "view_all"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "table-responsive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "table table-borderless align-middle mb-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "text-muted fw-bold x-small text-uppercase ps-0",
													style: {
														fontSize: "0.75rem",
														letterSpacing: "0.05em"
													},
													children: "System"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "text-muted fw-bold x-small text-uppercase",
													style: {
														fontSize: "0.75rem",
														letterSpacing: "0.05em"
													},
													children: "Task Details"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "text-muted fw-bold x-small text-uppercase",
													style: {
														fontSize: "0.75rem",
														letterSpacing: "0.05em"
													},
													children: "Priority"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "text-muted fw-bold x-small text-uppercase",
													style: {
														fontSize: "0.75rem",
														letterSpacing: "0.05em"
													},
													children: "Timeline"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "text-muted fw-bold x-small text-uppercase text-end pe-0",
													style: {
														fontSize: "0.75rem",
														letterSpacing: "0.05em"
													},
													children: "Action"
												})
											] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
												{
													system: "HRMS",
													title: "John Doe - Annual Leave",
													subTitle: "Leave Approval",
													priority: "High",
													priorityStyle: {
														backgroundColor: isDark ? "rgba(217, 119, 6, 0.15)" : "#fffbeb",
														color: "#d97706"
													},
													timeline: "2h ago"
												},
												{
													system: "PMS",
													title: "Project X - Phase 1 Completion",
													subTitle: "Milestone Update",
													priority: "Medium",
													priorityStyle: {
														backgroundColor: isDark ? "rgba(37, 99, 235, 0.15)" : "#eff6ff",
														color: "#2563eb"
													},
													timeline: "5h ago"
												},
												{
													system: "FMS",
													title: "Travel Reimbursement - #4421",
													subTitle: "Expense Claim",
													priority: "Low",
													priorityStyle: {
														backgroundColor: isDark ? "rgba(8, 145, 178, 0.15)" : "#ecfeff",
														color: "#0891b2"
													},
													timeline: "1d ago"
												},
												{
													system: "TMS",
													title: "Complete Security Audit",
													subTitle: "Task Overdue",
													priority: "Critical",
													priorityStyle: {
														backgroundColor: isDark ? "rgba(220, 38, 38, 0.15)" : "#fef2f2",
														color: "#dc2626"
													},
													timeline: "Overdue",
													timelineColor: "#dc2626"
												}
											].map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-bottom border-light",
												style: { borderBottomColor: isDark ? "rgba(255,255,255,0.05)" : "#f8f9fa" },
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "ps-0 py-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `badge rounded-pill px-3 py-2 fw-bold border ${isDark ? "bg-white bg-opacity-5 text-white-50 border-white border-opacity-10" : "bg-white text-dark border-secondary border-opacity-20"}`,
															style: { fontSize: "0.75rem" },
															children: item.system
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: `fw-bold ${isDark ? "text-white" : "text-dark"}`,
															style: { fontSize: "0.95rem" },
															children: item.title
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-muted small",
															style: { fontSize: "0.8rem" },
															children: item.subTitle
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "badge px-3 py-2 rounded-pill fw-bold",
															style: {
																...item.priorityStyle,
																fontSize: "0.75rem"
															},
															children: item.priority
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex align-items-center gap-2 text-muted fw-semibold",
															style: {
																fontSize: "0.85rem",
																color: item.timelineColor
															},
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faClock,
																style: { opacity: .7 }
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.timeline })]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "text-end pe-0 py-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "btn btn-link p-0 text-primary hover-scale transition-all",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faArrowRight,
																className: "fs-5"
															})
														})
													})
												]
											}, index)) })]
										})
									})]
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `card border-0 shadow-sm h-100 ${isDark ? "bg-dark-card border-white border-opacity-10" : "bg-white"}`,
								style: {
									borderRadius: "24px",
									border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card-body p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-3 mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `p-2 rounded-3 ${isDark ? "bg-white bg-opacity-10 text-white" : "bg-light text-dark"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faHistory,
												className: "fs-5"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: `fw-black mb-0 ${isDark ? "text-white" : "text-dark"}`,
											children: "Activity Stream"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "ps-2",
										children: [
											{
												user: "Admin",
												action: "Modified Role",
												target: "Manager",
												time: "10m ago",
												color: "#3b82f6"
											},
											{
												user: "System",
												action: "Backup Completed",
												target: "Cloud Node 1",
												time: "45m ago",
												color: "#10b981"
											},
											{
												user: "HR",
												action: "Onboarded User",
												target: "Jane Smith",
												time: "1h ago",
												color: "#06b6d4"
											},
											{
												user: "Admin",
												action: "Security Policy Update",
												target: "Firewall",
												time: "2h ago",
												color: "#ef4444"
											},
											{
												user: "System",
												action: "Scheduled Maintenance",
												target: "DB Cluster",
												time: "4h ago",
												color: "#f59e0b"
											}
										].map((item, index, arr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex position-relative pb-4",
											children: [
												index < arr.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "position-absolute",
													style: {
														left: "5px",
														top: "16px",
														bottom: "-16px",
														width: "2px",
														backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "rounded-circle me-3 mt-1 flex-shrink-0",
													style: {
														width: "12px",
														height: "12px",
														backgroundColor: item.color,
														zIndex: 1,
														boxShadow: `0 0 8px ${item.color}80`
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "small",
														style: { fontSize: "0.85rem" },
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: `fw-bold ${isDark ? "text-white" : "text-dark"}`,
															children: [item.user, " "]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted",
															children: item.action
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "fw-bold my-1",
														style: {
															color: isDark ? "#60a5fa" : "#2563eb",
															fontSize: "0.9rem"
														},
														children: item.target
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted x-small",
														style: { fontSize: "0.75rem" },
														children: item.time
													})
												] })
											]
										}, index))
									})]
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card border-0 shadow-sm h-100",
								style: { borderRadius: "16px" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "fw-bold mb-1",
										children: t("core_systems_health")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted small mb-0",
										children: t("real_time_status_desc")
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-light-primary btn-sm rounded-pill px-3 fw-bold",
										children: t("system_logs")
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card-body p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "row g-3",
										children: systems.map((system, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "col-md-6",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 border rounded-4 bg-light-subtle",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex justify-content-between align-items-center mb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "fw-bold small",
														children: system.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `badge bg-${system.status === "Active" ? "success" : "warning"}-subtle text-${system.status === "Active" ? "success" : "warning"} rounded-pill`,
														style: { fontSize: "0.65rem" },
														children: system.status === "Active" ? t("active") : system.status
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex-grow-1",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "progress",
															style: { height: "4px" },
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "progress-bar bg-primary",
																style: { width: `${system.load}%` }
															})
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
														className: "text-muted fw-bold",
														style: { fontSize: "0.7rem" },
														children: [system.load, "%"]
													})]
												})]
											})
										}, i))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 p-4 rounded-4 bg-dark text-white d-flex align-items-center justify-content-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-circle bg-success d-flex align-items-center justify-content-center shadow-lg",
												style: {
													width: "40px",
													height: "40px",
													animation: "pulse 2s infinite"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faMicrochip })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
												className: "mb-0 fw-bold",
												children: t("main_processing_unit")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
												className: "text-white-50",
												children: "Node v18.x | Latency: 24ms"
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-end",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "fw-bold",
												children: t("stable_caps")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
												className: "text-success small",
												children: [t("security_patch"), " v2.4"]
											})]
										})]
									})]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card border-0 shadow-sm h-100 bg-primary text-white overflow-hidden",
								style: { borderRadius: "16px" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card-body p-4 position-relative",
									style: { zIndex: 1 },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
											className: "fw-bold mb-4",
											children: t("security_overview")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-3 mb-3 p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faLock,
															className: "fs-5"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
															className: "mb-0 small fw-bold",
															children: t("ssl_certificate")
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
															className: "text-white-50",
															children: t("valid_days")
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faCheckCircle,
															className: "ms-auto text-success"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-3 mb-3 p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faShieldHalved,
															className: "fs-5"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
															className: "mb-0 small fw-bold",
															children: t("brute_force_protection")
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
															className: "text-white-50",
															children: t("enabled_monitoring")
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faCheckCircle,
															className: "ms-auto text-success"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-3 p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faExclamationCircle,
															className: "fs-5"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
															className: "mb-0 small fw-bold",
															children: t("failed_login_attempts")
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
															className: "text-white-50",
															children: ["12 ", t("attempts_today")]
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ms-auto badge bg-warning text-dark px-2",
															children: t("review")
														})
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-white w-100 rounded-pill fw-bold text-primary py-2 mt-2",
											children: t("security_settings")
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faShieldHalved,
									className: "position-absolute",
									style: {
										fontSize: "12rem",
										right: "-2rem",
										bottom: "-2rem",
										opacity: .05,
										zIndex: 0
									}
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
							className: "fw-bold mb-4 d-flex align-items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCubes,
								className: "text-primary small"
							}), t("quick_access_modules")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-lg-3 col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutButton, {
										label: t("permissions"),
										description: t("dashboard_permissions_desc"),
										icon: faShieldHalved,
										color: "danger",
										onClick: () => setActiveTab("permissions"),
										t
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-lg-3 col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutButton, {
										label: t("roles_mgmt"),
										description: t("dashboard_roles_mgmt_desc"),
										icon: faUserTag,
										color: "success",
										onClick: () => setActiveTab("roles"),
										t
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-lg-3 col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutButton, {
										label: t("user_directory"),
										description: t("dashboard_user_directory_desc"),
										icon: faUsers,
										color: "primary",
										onClick: () => setActiveTab("users"),
										t
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-lg-3 col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutButton, {
										label: t("data_backup"),
										description: t("dashboard_data_backup_desc"),
										icon: faDatabase,
										color: "info",
										onClick: () => setActiveTab("data-backup"),
										t
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-lg-3 col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutButton, {
										label: t("data_limits"),
										description: t("dashboard_data_limits_desc"),
										icon: faShieldHalved,
										color: "warning",
										onClick: () => setActiveTab("data-limits"),
										t
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-lg-3 col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutButton, {
										label: t("user_limits"),
										description: t("dashboard_user_limits_desc"),
										icon: faUserShield,
										color: "primary",
										onClick: () => setActiveTab("user-limits"),
										t
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-lg-3 col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutButton, {
										label: t("theme_editor"),
										description: t("dashboard_theme_editor_desc"),
										icon: faPlus,
										color: "warning",
										onClick: () => setActiveTab("theme"),
										t
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-lg-3 col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutButton, {
										label: t("navbar_config"),
										description: t("dashboard_navbar_config_desc"),
										icon: faCubes,
										color: "secondary",
										onClick: () => setActiveTab("topnavbar-settings"),
										t
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-4 mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmergencyOps, { isDark })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-4 rounded-5 shadow-2xl h-100 ${isDark ? "bg-dark-card border-info border-opacity-20" : "bg-white border-info border-opacity-10"}`,
								style: { border: "1px solid" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center justify-content-between mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-2 rounded-3 bg-info bg-opacity-10 text-info",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faScaleBalanced })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											className: `fw-black mb-0 ${isDark ? "text-white" : "text-dark"}`,
											children: "Compliance Center"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											className: "text-muted fw-bold x-small",
											children: "Regulatory & Governance Overview"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-xs btn-light-info rounded-pill fw-black px-3",
										children: "Run Audit"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: [
										{
											label: "GDPR Compliance",
											status: "Compliant",
											progress: 100,
											color: "success"
										},
										{
											label: "SOC2 Type II",
											status: "In Review",
											progress: 85,
											color: "info"
										},
										{
											label: "ISO 27001",
											status: "Expiring Soon",
											progress: 92,
											color: "warning"
										}
									].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "small fw-bold text-muted",
											children: item.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `x-small fw-black text-${item.color}`,
											children: item.status
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress",
										style: { height: "6px" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `progress-bar bg-${item.color}`,
											style: { width: `${item.progress}%` }
										})
									})] }, item.label))
								})]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .bg-primary-subtle { background-color: rgba(var(--bs-primary-rgb), 0.1); }
        .bg-success-subtle { background-color: rgba(var(--bs-success-rgb), 0.1); }
        .bg-info-subtle { background-color: rgba(var(--bs-info-rgb), 0.1); }
        .bg-warning-subtle { background-color: rgba(var(--bs-warning-rgb), 0.1); }
        .bg-danger-subtle { background-color: rgba(var(--bs-danger-rgb), 0.1); }
        .btn-light-primary { background-color: rgba(var(--bs-primary-rgb), 0.05); color: var(--bs-primary); border: none; }
        .btn-light-primary:hover { background-color: rgba(var(--bs-primary-rgb), 0.1); color: var(--bs-primary); }
        .btn-white { background-color: white; border: none; }
        .btn-white:hover { background-color: #f8f9fa; }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important; }
        .hover-lift-lg:hover { transform: translateY(-10px); box-shadow: 0 1.5rem 4rem rgba(31, 38, 135, 0.15) !important; }
        
        .group:hover .group-hover-scale-rotate { transform: translate(15%, -15%) scale(1.15) rotate(5deg) !important; opacity: 0.25 !important; }
        .group:hover .group-hover-bounce { transform: translateY(-10px); }
        .group:hover .group-hover-width { padding-left: 2rem !important; padding-right: 2rem !important; box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important; }
        .group:hover .group-hover-translate-x { transform: translateX(5px); }
        .group:hover .group-hover-shine { opacity: 0.4 !important; transform: translateX(100%) skewX(-15deg) !important; transition: transform 0.7s ease-in-out !important; }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(25, 135, 84, 0); }
          100% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animated-blob { animation: blob 7s infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .blur-4xl { filter: blur(100px); }
        .ls-tight { letter-spacing: -0.02em; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
        .bg-gradient-dark-blue { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
        .pulse-dot { width: 12px; height: 12px; border-radius: 50%; animation: pulse-green 2s infinite; }
        @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

        .z-n1 { z-index: -1; }
        .group-hover-shine { transition: transform 0s; }
      ` })
		]
	}) });
};
//#endregion
export { AdminOverview as default };
