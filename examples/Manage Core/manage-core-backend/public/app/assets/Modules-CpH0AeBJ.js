import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Dl as require_jsx_runtime, Gn as faCopy, Mn as faCode, Vi as faHeartbeat, Wr as faFileInvoiceDollar, bl as useApp, da as faLayerGroup, ic as faTerminal, in as faChevronRight, ir as faDollarSign, ji as faHandshake, jo as faProjectDiagram, li as faFolderOpen, nc as faTasks, nn as faChevronDown, os as faSearch, ru as require_react, ta as faIndustry, tl as faUsers, vl as FontAwesomeIcon, wo as faPlay } from "./ai-BHgPkVLC.js";
import { C as FEATURE_REGISTRY } from "./pms-CfRqXdhw.js";
//#region src/pages/Permissions&Modules/Modules.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var systemMeta = {
	pms: {
		label: "PMS",
		full: "Project Management System",
		icon: faProjectDiagram,
		color: "#0d6efd",
		gradient: "linear-gradient(135deg, #0d6efd, #0a58ca)"
	},
	hrms: {
		label: "HRMS",
		full: "Human Resource Management System",
		icon: faUsers,
		color: "#6f42c1",
		gradient: "linear-gradient(135deg, #6f42c1, #59359a)"
	},
	fms: {
		label: "FMS",
		full: "Financial Management System",
		icon: faFileInvoiceDollar,
		color: "#198754",
		gradient: "linear-gradient(135deg, #198754, #146c43)"
	},
	tms: {
		label: "TMS",
		full: "Task Management System",
		icon: faTasks,
		color: "#fd7e14",
		gradient: "linear-gradient(135deg, #fd7e14, #ca6510)"
	},
	dms: {
		label: "DMS",
		full: "Document Management System",
		icon: faFolderOpen,
		color: "#0dcaf0",
		gradient: "linear-gradient(135deg, #0dcaf0, #0bacbe)"
	},
	crm: {
		label: "CRM",
		full: "Customer Relationship Management",
		icon: faHandshake,
		color: "#d63384",
		gradient: "linear-gradient(135deg, #d63384, #ab296a)"
	},
	mfg: {
		label: "MFG",
		full: "Manufacturing Management System",
		icon: faIndustry,
		color: "#059669",
		gradient: "linear-gradient(135deg, #059669, #047857)"
	},
	fx: {
		label: "FX",
		full: "Multi-Currency & Exchange System",
		icon: faDollarSign,
		color: "#8b5cf6",
		gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)"
	}
};
var defaultSystemMeta = (key) => ({
	label: key.toUpperCase(),
	full: `${key.toUpperCase()} System`,
	icon: faLayerGroup,
	color: "#64748b",
	gradient: "linear-gradient(135deg, #64748b, #475569)"
});
var getSystemMeta = (key) => systemMeta[key] || defaultSystemMeta(key);
var Modules = () => {
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [expandedSystems, setExpandedSystems] = (0, import_react.useState)(Object.keys(FEATURE_REGISTRY).reduce((a, k) => ({
		...a,
		[k]: true
	}), {}));
	const [expandedGroups, setExpandedGroups] = (0, import_react.useState)({});
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const [copiedType, setCopiedType] = (0, import_react.useState)(null);
	const [diagSystem, setDiagSystem] = (0, import_react.useState)(null);
	const [diagProgress, setDiagProgress] = (0, import_react.useState)(0);
	const [diagLogs, setDiagLogs] = (0, import_react.useState)([]);
	const [isDiagRunning, setIsDiagRunning] = (0, import_react.useState)(false);
	const toggleSystem = (key) => setExpandedSystems((p) => ({
		...p,
		[key]: !p[key]
	}));
	const toggleGroup = (key) => setExpandedGroups((p) => ({
		...p,
		[key]: !p[key]
	}));
	const totalGroups = (0, import_react.useMemo)(() => {
		return Object.values(FEATURE_REGISTRY).reduce((acc, groups) => acc + groups.length, 0);
	}, []);
	const totalFeatures = (0, import_react.useMemo)(() => {
		return Object.values(FEATURE_REGISTRY).reduce((acc, groups) => {
			return acc + groups.reduce((sum, group) => sum + group.features.length, 0);
		}, 0);
	}, []);
	const systems = (0, import_react.useMemo)(() => {
		return Object.entries(FEATURE_REGISTRY).map(([key, groups]) => {
			const filteredGroups = groups.map((group) => {
				const filteredFeatures = group.features.filter((f) => f.label.toLowerCase().includes(searchTerm.toLowerCase()) || f.description.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase()));
				return {
					...group,
					features: filteredFeatures
				};
			}).filter((g) => g.features.length > 0);
			const meta = getSystemMeta(key);
			return {
				key,
				meta,
				groups: filteredGroups,
				matchesSystem: key.toLowerCase().includes(searchTerm.toLowerCase()) || meta.full.toLowerCase().includes(searchTerm.toLowerCase())
			};
		}).filter((s) => s.groups.length > 0 || s.matchesSystem);
	}, [searchTerm]);
	const c = {
		bg: isDark ? "#1e293b" : "#ffffff",
		bgAlt: isDark ? "#0f172a" : "#f8f9fa",
		bgHover: isDark ? "#1e293b" : "#f8fafc",
		border: isDark ? "#334155" : "#eef2f6",
		borderLight: isDark ? "#2d3a4e" : "#edf2f7",
		text: isDark ? "#f1f5f9" : "#0f172a",
		textSec: isDark ? "#94a3b8" : "#475569",
		textMuted: isDark ? "#64748b" : "#94a3b8",
		codeBg: isDark ? "#334155" : "#f1f5f9",
		badgeBg: isDark ? "#334155" : "#f1f5f9",
		cardBg: isDark ? "#111827" : "#ffffff",
		sectionBg: isDark ? "#0f172a" : "#fafbfc",
		caption: isDark ? "#475569" : "#94a3b8"
	};
	const handleCopyCode = (id, type) => {
		let snippet = "";
		if (type === "react") snippet = `const { hasPermission } = useAuth();\nif (hasPermission('${id}')) {\n  // Access granted\n}`;
		else snippet = `@can('${id}')\n  <!-- Access granted -->\n@endcan`;
		navigator.clipboard.writeText(snippet).then(() => {
			setCopiedId(id);
			setCopiedType(type);
			addNotification(`Copied ${type === "react" ? "React" : "Laravel"} snippet to clipboard`, "success");
			setTimeout(() => {
				setCopiedId(null);
				setCopiedType(null);
			}, 2e3);
		});
	};
	const runDiagnostics = (systemKey) => {
		const meta = getSystemMeta(systemKey);
		setDiagSystem(meta);
		setIsDiagRunning(true);
		setDiagProgress(0);
		setDiagLogs([]);
		const logSequence = [
			{
				prg: 10,
				log: `[SYSTEM] Initializing diagnostics check for modular cluster: ${meta.label}...`
			},
			{
				prg: 25,
				log: `[DATABASE] Connecting to isolation workspace... OK (Master Server local)`
			},
			{
				prg: 40,
				log: `[SCHEMA] Validating module table migrations and column indices... OK`
			},
			{
				prg: 65,
				log: `[RBAC] Scanning active permission keys mapping... Mapped successfully.`
			},
			{
				prg: 80,
				log: `[ROUTING] Checking controller bindings and middleware layers... Bindings OK.`
			},
			{
				prg: 100,
				log: `[COMPLIANCE] All module boundaries are intact. Core status: 100% operational.`
			}
		];
		let currentStep = 0;
		const interval = setInterval(() => {
			if (currentStep < logSequence.length) {
				const step = logSequence[currentStep];
				setDiagProgress(step.prg);
				setDiagLogs((prev) => [...prev, step.log]);
				currentStep++;
			} else {
				clearInterval(interval);
				setIsDiagRunning(false);
			}
		}, 400);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fade-in pb-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-black mb-1",
					children: "System Modules"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-0",
					children: "Explore all available systems, feature groups, and module capabilities across the platform."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "input-group rounded-pill overflow-hidden shadow-sm border bg-white",
						style: { maxWidth: "320px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "input-group-text bg-transparent border-0 text-muted px-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							className: "form-control border-0 ps-0 shadow-none bg-transparent",
							placeholder: "Search modules & features...",
							value: searchTerm,
							onChange: (e) => setSearchTerm(e.target.value)
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						label: "Active Core Systems",
						value: `${Object.keys(FEATURE_REGISTRY).length} / ${Object.keys(FEATURE_REGISTRY).length}`,
						subtitle: "100% Core coverage",
						gradient: "linear-gradient(135deg, #0d6efd, #0284c7)",
						icon: faProjectDiagram
					},
					{
						label: "Feature Groups",
						value: totalGroups,
						subtitle: "Active taxonomies",
						gradient: "linear-gradient(135deg, #6f42c1, #7c3aed)",
						icon: faLayerGroup
					},
					{
						label: "Platform Features",
						value: totalFeatures,
						subtitle: "RBAC permissions mapped",
						gradient: "linear-gradient(135deg, #fd7e14, #ea580c)",
						icon: faTasks
					},
					{
						label: "Overall Core Health",
						value: "99.8%",
						subtitle: "Cluster status: Normal",
						gradient: "linear-gradient(135deg, #198754, #10b981)",
						icon: faHeartbeat
					}
				].map((stat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-6 col-xl-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "position-relative overflow-hidden rounded-3 h-100",
						style: {
							background: c.cardBg,
							border: `1px solid ${c.border}`,
							boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "position-absolute",
							style: {
								top: 0,
								left: 0,
								right: 0,
								height: "3px",
								background: stat.gradient
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex justify-content-between align-items-start mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex align-items-center justify-content-center rounded-2",
									style: {
										width: "34px",
										height: "34px",
										background: `${stat.gradient.includes("0d6efd") ? "#0d6efd" : stat.gradient.includes("6f42c1") ? "#6f42c1" : stat.gradient.includes("fd7e14") ? "#fd7e14" : "#198754"}12`,
										color: stat.gradient.includes("0d6efd") ? "#0d6efd" : stat.gradient.includes("6f42c1") ? "#6f42c1" : stat.gradient.includes("fd7e14") ? "#fd7e14" : "#198754"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: stat.icon,
										style: { fontSize: "15px" }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "small text-uppercase",
									style: {
										fontSize: "10px",
										fontWeight: 600,
										letterSpacing: "0.05em",
										color: c.caption
									},
									children: stat.label
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "fw-black d-block",
									style: {
										fontSize: "1.65rem",
										letterSpacing: "-0.03em",
										lineHeight: 1.1,
										color: c.text
									},
									children: stat.value
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "small",
									style: {
										color: c.textMuted,
										fontSize: "0.75rem"
									},
									children: stat.subtitle
								})]
							})]
						})]
					})
				}, i))
			}),
			systems.map((system) => {
				const meta = system.meta || getSystemMeta(system.key);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center justify-content-between px-3 py-2 rounded-top",
						style: {
							background: `linear-gradient(135deg, ${meta.color}, ${meta.color}dd)`,
							cursor: "pointer",
							userSelect: "none"
						},
						onClick: () => toggleSystem(system.key),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex align-items-center justify-content-center rounded-1",
									style: {
										width: "28px",
										height: "28px",
										background: "rgba(255,255,255,0.18)"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: meta.icon,
										className: "text-white",
										style: { fontSize: "14px" }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "fw-semibold text-white",
									style: { fontSize: "0.8125rem" },
									children: [
										meta.label,
										" — ",
										meta.full
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-pill px-2",
									style: {
										fontSize: "10px",
										fontWeight: 600,
										background: "rgba(255,255,255,0.18)",
										color: "rgba(255,255,255,0.9)"
									},
									children: [system.groups.reduce((s, g) => s + g.features.length, 0), " features"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-sm d-flex align-items-center gap-1.5 rounded-pill px-2.5 py-1 border-0",
								style: {
									fontSize: "10px",
									fontWeight: 600,
									background: "rgba(255,255,255,0.15)",
									color: "#fff"
								},
								onMouseEnter: (e) => {
									e.currentTarget.style.background = "rgba(255,255,255,0.25)";
								},
								onMouseLeave: (e) => {
									e.currentTarget.style.background = "rgba(255,255,255,0.15)";
								},
								onClick: (e) => {
									e.stopPropagation();
									runDiagnostics(system.key);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPlay,
									style: { fontSize: "9px" }
								}), " Diagnostics"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: expandedSystems[system.key] ? faChevronDown : faChevronRight,
								className: "text-white",
								style: {
									fontSize: "11px",
									opacity: .7
								}
							})]
						})]
					}), expandedSystems[system.key] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-start border-end border-bottom rounded-bottom",
						style: {
							borderColor: `${c.border} !important`,
							background: c.sectionBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row g-2",
								children: system.groups.map((group) => {
									const groupKey = `${system.key}_${group.label.replace(/\s+/g, "_")}`;
									const isGroupOpen = expandedGroups[groupKey] !== false;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-12 col-xl-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2 overflow-hidden",
											style: {
												border: `1px solid ${c.border}`,
												background: c.bg
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center justify-content-between px-3 py-2",
												style: {
													cursor: "pointer",
													borderBottom: isGroupOpen ? `1px solid ${c.border}` : "none",
													background: c.bg
												},
												onClick: () => toggleGroup(groupKey),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "d-flex align-items-center justify-content-center rounded-1",
															style: {
																width: "24px",
																height: "24px",
																background: `${meta.color}10`
															},
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faLayerGroup,
																style: {
																	color: meta.color,
																	fontSize: "11px"
																}
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "fw-semibold",
															style: {
																fontSize: "0.8125rem",
																color: c.text
															},
															children: group.label
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded-pill px-2",
															style: {
																fontSize: "10px",
																fontWeight: 600,
																background: c.badgeBg,
																color: c.textSec
															},
															children: group.features.length
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: isGroupOpen ? faChevronDown : faChevronRight,
													className: "text-muted",
													style: { fontSize: "10px" }
												})]
											}), isGroupOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "p-2",
												style: { background: c.bgAlt },
												children: group.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center justify-content-between px-2.5 py-2 rounded-1 mb-1",
													style: {
														background: c.bg,
														borderLeft: `3px solid ${meta.color}`,
														transition: "all 0.12s ease"
													},
													onMouseEnter: (e) => {
														e.currentTarget.style.background = c.bgHover;
														e.currentTarget.style.borderLeftColor = meta.color;
													},
													onMouseLeave: (e) => {
														e.currentTarget.style.background = c.bg;
														e.currentTarget.style.borderLeftColor = meta.color;
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0 flex-grow-1",
														style: { paddingRight: "8px" },
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex align-items-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "fw-semibold d-block text-truncate",
																style: {
																	fontSize: "0.8125rem",
																	color: c.text
																},
																children: f.label
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
																className: "rounded px-1.5 flex-shrink-0",
																style: {
																	fontSize: "9px",
																	color: c.textMuted,
																	background: c.codeBg,
																	fontFamily: "'SF Mono', 'Fira Code', monospace",
																	lineHeight: "18px"
																},
																children: f.id
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
															className: "d-block text-truncate",
															style: {
																fontSize: "0.6875rem",
																color: c.caption,
																marginTop: "1px"
															},
															children: f.description
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex align-items-center gap-1 flex-shrink-0",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																className: "btn btn-xs d-flex align-items-center gap-1 rounded-1 border-0 px-1.5",
																title: "Copy React snippet",
																style: {
																	fontSize: "9px",
																	background: c.badgeBg,
																	color: c.textSec,
																	lineHeight: "20px"
																},
																onMouseEnter: (e) => {
																	e.currentTarget.style.background = c.codeBg;
																},
																onMouseLeave: (e) => {
																	e.currentTarget.style.background = c.badgeBg;
																},
																onClick: () => handleCopyCode(f.id, "react"),
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																	icon: faCode,
																	style: {
																		fontSize: "8px",
																		color: "#3b82f6"
																	}
																}), copiedId === f.id && copiedType === "react" ? "Copied!" : "React"]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																className: "btn btn-xs d-flex align-items-center gap-1 rounded-1 border-0 px-1.5",
																title: "Copy Laravel snippet",
																style: {
																	fontSize: "9px",
																	background: c.badgeBg,
																	color: c.textSec,
																	lineHeight: "20px"
																},
																onMouseEnter: (e) => {
																	e.currentTarget.style.background = c.codeBg;
																},
																onMouseLeave: (e) => {
																	e.currentTarget.style.background = c.badgeBg;
																},
																onClick: () => handleCopyCode(f.id, "laravel"),
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																	icon: faCopy,
																	style: {
																		fontSize: "8px",
																		color: "#10b981"
																	}
																}), copiedId === f.id && copiedType === "laravel" ? "Copied!" : "Laravel"]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faCheckCircle,
																style: {
																	color: "#22c55e",
																	fontSize: "11px",
																	opacity: .5,
																	marginLeft: "2px"
																}
															})
														]
													})]
												}, f.id))
											})]
										})
									}, groupKey);
								})
							})
						})
					})]
				}, system.key);
			}),
			systems.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-5 rounded-4 border",
				style: {
					background: c.bg,
					borderColor: c.border
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faLayerGroup,
					className: "mb-3",
					style: {
						color: c.caption,
						opacity: .25,
						fontSize: "3rem"
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: { color: c.textMuted },
					children: "No modules match your search query."
				})]
			}),
			diagSystem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3",
				style: {
					zIndex: 2e3,
					backgroundColor: "rgba(15, 23, 42, 0.65)",
					backdropFilter: "blur(8px)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card border-0 shadow-lg rounded-4 overflow-hidden w-100",
					style: {
						maxWidth: "600px",
						background: "#0f172a",
						border: "1px solid rgba(255,255,255,0.08)"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-header bg-dark bg-opacity-50 p-4 d-flex justify-content-between align-items-center border-0 border-bottom border-secondary border-opacity-25",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2.5 rounded-3 text-white",
								style: { background: diagSystem.gradient },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTerminal })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
								className: "fw-black mb-0 text-white",
								children: ["Diagnostics: ", diagSystem.label]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted small mb-0 font-monospace",
								children: [
									"v",
									diagSystem.label === "PMS" ? "3.1.0" : diagSystem.label === "HRMS" ? "2.4.1" : "1.0.0",
									"-STABLE"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-link text-muted",
							onClick: () => setDiagSystem(null),
							disabled: isDiagRunning,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white fs-5",
								children: "×"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-body p-4 bg-dark text-light font-monospace",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-black rounded-3 mb-4 overflow-auto border border-secondary border-opacity-25",
								style: {
									height: "240px",
									fontSize: "12px",
									color: "#10b981",
									textShadow: "0 0 4px rgba(16, 185, 129, 0.4)"
								},
								children: [diagLogs.map((log, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted select-none",
										children: ">\xA0"
									}), log]
								}, idx)), isDiagRunning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2 mt-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted select-none",
											children: ">\xA0"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "spinner-border spinner-border-sm text-success",
											role: "status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "animate-pulse",
											children: "Checking records..."
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center mb-1 text-muted small",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Diagnostic Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "fw-bold text-white",
										children: [diagProgress, "%"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress",
									style: {
										height: "6px",
										borderRadius: "10px",
										backgroundColor: "rgba(255,255,255,0.08)"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress-bar bg-success",
										style: {
											width: `${diagProgress}%`,
											transition: "width 0.3s ease",
											boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)"
										}
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 d-flex justify-content-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-light rounded-pill px-4 fw-bold py-2 shadow-sm font-monospace border-0",
									style: { fontSize: "13px" },
									onClick: () => setDiagSystem(null),
									disabled: isDiagRunning,
									children: isDiagRunning ? "Analyzing..." : "Dismiss"
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .cursor-pointer { cursor: pointer; }
        .animate-pulse {
          animation: pulse-terminal 1.5s infinite;
        }
        @keyframes pulse-terminal {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      ` })
		]
	});
};
//#endregion
export { Modules as default };
