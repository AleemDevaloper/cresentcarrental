import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, Ol as apiRequest, Qt as faCheck, Rc as faUserCheck, Wr as faFileInvoiceDollar, Xo as faRotateLeft, bl as useApp, da as faLayerGroup, ga as faList, in as faChevronRight, it as faBars, ji as faHandshake, jo as faProjectDiagram, li as faFolderOpen, ms as faShield, nc as faTasks, nn as faChevronDown, os as faSearch, ra as faInfoCircle, rs as faSave, ru as require_react, sc as faThLarge, tl as faUsers, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { I as updateUserPermissions, P as listUsers } from "./superadmin-Cn5Mt1aQ.js";
import { a as updateRole, i as listRoles } from "./roles-CNnFlAEt.js";
import { C as FEATURE_REGISTRY } from "./pms-CfRqXdhw.js";
//#region src/api/permissions.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var listPermissionsFlat = async () => {
	return (await apiRequest("/api/v1/permissions/list")).data;
};
//#endregion
//#region src/pages/Permissions&Modules/Permissions.jsx
var import_jsx_runtime = require_jsx_runtime();
var systemMeta = {
	pms: {
		label: "PMS",
		icon: faProjectDiagram,
		color: "#0d6efd"
	},
	hrms: {
		label: "HRMS",
		icon: faUsers,
		color: "#6f42c1"
	},
	fms: {
		label: "FMS",
		icon: faFileInvoiceDollar,
		color: "#198754"
	},
	tms: {
		label: "TMS",
		icon: faTasks,
		color: "#fd7e14"
	},
	dms: {
		label: "DMS",
		icon: faFolderOpen,
		color: "#0dcaf0"
	},
	crm: {
		label: "CRM",
		icon: faHandshake,
		color: "#d63384"
	},
	systems: {
		label: "Systems",
		icon: faLayerGroup,
		color: "#0f172a"
	},
	sidebar: {
		label: "Sidebar",
		icon: faBars,
		color: "#6c757d"
	}
};
var buildStructuredPermissions = (permissionsData = []) => {
	const result = [];
	Object.entries(FEATURE_REGISTRY).forEach(([systemKey, groups]) => {
		const meta = systemMeta[systemKey] || {
			label: systemKey.toUpperCase(),
			icon: faLayerGroup,
			color: "#6c757d"
		};
		groups.forEach((group) => {
			group.features.forEach((f) => {
				result.push({
					id: f.id,
					name: f.label,
					system: systemKey,
					systemLabel: meta.label,
					systemIcon: meta.icon,
					systemColor: meta.color,
					groupLabel: group.label,
					description: f.description
				});
			});
		});
	});
	const systemAccessPermissions = permissionsData.filter((perm) => perm.slug?.startsWith("system_")).map((perm) => ({
		id: perm.slug,
		name: perm.name,
		system: "systems",
		systemLabel: "Systems",
		systemIcon: systemMeta.systems.icon,
		systemColor: systemMeta.systems.color,
		groupLabel: "System Access",
		description: perm.name
	}));
	const sidebarPermissions = permissionsData.filter((perm) => perm.module?.toLowerCase() === "sidebar" || perm.slug?.startsWith("sidebar_")).map((perm) => ({
		id: perm.slug,
		name: perm.name,
		system: "sidebar",
		systemLabel: "Sidebar",
		systemIcon: systemMeta.sidebar.icon,
		systemColor: systemMeta.sidebar.color,
		groupLabel: "Sidebar Navigation",
		description: perm.name
	}));
	if (systemAccessPermissions.length > 0) result.push(...systemAccessPermissions);
	if (sidebarPermissions.length > 0) result.push(...sidebarPermissions);
	return result;
};
var Permissions = () => {
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [collapsedSystems, setCollapsedSystems] = (0, import_react.useState)({});
	const [collapsedGroups, setCollapsedGroups] = (0, import_react.useState)({});
	const [viewMode, setViewMode] = (0, import_react.useState)("list");
	const [targetMode, setTargetMode] = (0, import_react.useState)("roles");
	const [activeRoleId, setActiveRoleId] = (0, import_react.useState)(null);
	const [activeUserId, setActiveUserId] = (0, import_react.useState)(null);
	const [userSearchTerm, setUserSearchTerm] = (0, import_react.useState)("");
	const [activeSystemFilter, setActiveSystemFilter] = (0, import_react.useState)("all");
	const [hoveredRow, setHoveredRow] = (0, import_react.useState)(null);
	const [hoveredCol, setHoveredCol] = (0, import_react.useState)(null);
	const [filterDropdownOpen, setFilterDropdownOpen] = (0, import_react.useState)(false);
	const filterDropdownRef = (0, import_react.useRef)(null);
	const [structuredPerms, setStructuredPerms] = (0, import_react.useState)(() => buildStructuredPermissions());
	const [matrixState, setMatrixState] = (0, import_react.useState)({});
	const [initialMatrixState, setInitialMatrixState] = (0, import_react.useState)({});
	const [userOverrides, setUserOverrides] = (0, import_react.useState)({});
	const [initialUserOverrides, setInitialUserOverrides] = (0, import_react.useState)({});
	const [permissionIdMap, setPermissionIdMap] = (0, import_react.useState)({});
	const highlightText = (text, search) => {
		if (!search || !text) return text;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text.split(new RegExp(`(${search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi")).map((part, i) => part.toLowerCase() === search.toLowerCase() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
			className: "p-0 bg-warning text-dark rounded px-1 fw-bold",
			children: part
		}, i) : part) });
	};
	const fetchData = async () => {
		setLoading(true);
		try {
			const [permissionsData, rolesData, usersData] = await Promise.all([
				listPermissionsFlat(),
				listRoles(),
				listUsers()
			]);
			const slugMap = {};
			permissionsData.forEach((perm) => {
				if (perm.slug) slugMap[perm.slug] = perm.id;
			});
			setPermissionIdMap(slugMap);
			setStructuredPerms(buildStructuredPermissions(permissionsData));
			setRoles(rolesData);
			setUsers(usersData);
			if (rolesData.length > 0) setActiveRoleId(rolesData[0].id);
			if (usersData.length > 0) setActiveUserId(usersData[0].id);
			const allPermIds = buildStructuredPermissions(permissionsData).map((p) => slugMap[p.id] ?? p.id);
			const initialRoleState = {};
			rolesData.forEach((role) => {
				const apiIds = role.permissions?.map((p) => p.id) || [];
				initialRoleState[role.id] = [...new Set([...apiIds.filter((id) => allPermIds.includes(id))])];
			});
			setMatrixState(initialRoleState);
			setInitialMatrixState(JSON.parse(JSON.stringify(initialRoleState)));
			const initialOverrides = {};
			usersData.forEach((user) => {
				initialOverrides[user.id] = user.directPermissions?.filter((id) => allPermIds.includes(id)) || [];
			});
			setUserOverrides(initialOverrides);
			setInitialUserOverrides(JSON.parse(JSON.stringify(initialOverrides)));
			const initCollapsed = {};
			Object.keys(FEATURE_REGISTRY).forEach((k) => {
				initCollapsed[k] = false;
			});
			setCollapsedSystems(initCollapsed);
		} catch {
			addNotification("Failed to fetch permissions data", "danger");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (e) => {
			if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) setFilterDropdownOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const isDirty = (0, import_react.useMemo)(() => {
		if (targetMode === "roles") return JSON.stringify(matrixState) !== JSON.stringify(initialMatrixState);
		return JSON.stringify(userOverrides) !== JSON.stringify(initialUserOverrides);
	}, [
		matrixState,
		initialMatrixState,
		userOverrides,
		initialUserOverrides,
		targetMode
	]);
	const resolvePermissionId = (permissionIdOrSlug) => {
		if (typeof permissionIdOrSlug === "number") return permissionIdOrSlug;
		return permissionIdMap[permissionIdOrSlug] ?? permissionIdOrSlug;
	};
	const togglePermission = (targetId, permId) => {
		const resolvedId = resolvePermissionId(permId);
		if (targetMode === "roles") setMatrixState((prev) => {
			const current = prev[targetId] || [];
			const updated = current.includes(resolvedId) ? current.filter((p) => p !== resolvedId) : [...current, resolvedId];
			return {
				...prev,
				[targetId]: updated
			};
		});
		else setUserOverrides((prev) => {
			const current = prev[targetId] || [];
			const updated = current.includes(resolvedId) ? current.filter((p) => p !== resolvedId) : [...current, resolvedId];
			return {
				...prev,
				[targetId]: updated
			};
		});
	};
	const toggleSystemForTarget = (targetId, systemPerms, shouldEnable) => {
		const ids = systemPerms.map((p) => resolvePermissionId(p.id));
		if (targetMode === "roles") setMatrixState((prev) => {
			const current = prev[targetId] || [];
			const updated = shouldEnable ? [...new Set([...current, ...ids])] : current.filter((p) => !ids.includes(p));
			return {
				...prev,
				[targetId]: updated
			};
		});
		else setUserOverrides((prev) => {
			const current = prev[targetId] || [];
			const updated = shouldEnable ? [...new Set([...current, ...ids])] : current.filter((p) => !ids.includes(p));
			return {
				...prev,
				[targetId]: updated
			};
		});
	};
	const handleSave = async () => {
		setSaving(true);
		try {
			if (targetMode === "roles") {
				const promises = [];
				Object.keys(matrixState).forEach((roleId) => {
					if (JSON.stringify(matrixState[roleId]) !== JSON.stringify(initialMatrixState[roleId])) {
						const role = roles.find((r) => r.id === parseInt(roleId));
						promises.push(updateRole(roleId, {
							...role,
							permissions: matrixState[roleId]
						}));
					}
				});
				await Promise.all(promises);
				setInitialMatrixState(JSON.parse(JSON.stringify(matrixState)));
			} else {
				const promises = [];
				Object.keys(userOverrides).forEach((userId) => {
					if (JSON.stringify(userOverrides[userId]) !== JSON.stringify(initialUserOverrides[userId])) promises.push(updateUserPermissions(userId, userOverrides[userId]));
				});
				await Promise.all(promises);
				setInitialUserOverrides(JSON.parse(JSON.stringify(userOverrides)));
			}
			addNotification("Permissions updated successfully", "success");
		} catch {
			addNotification("Failed to save changes", "danger");
		} finally {
			setSaving(false);
		}
	};
	const handleReset = () => {
		if (targetMode === "roles") setMatrixState(JSON.parse(JSON.stringify(initialMatrixState)));
		else setUserOverrides(JSON.parse(JSON.stringify(initialUserOverrides)));
	};
	const toggleCollapseSystem = (key) => setCollapsedSystems((p) => ({
		...p,
		[key]: !p[key]
	}));
	const toggleCollapseGroup = (key) => setCollapsedGroups((p) => ({
		...p,
		[key]: !p[key]
	}));
	const filteredPerms = (0, import_react.useMemo)(() => {
		return structuredPerms.filter((p) => {
			const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.systemLabel.toLowerCase().includes(searchTerm.toLowerCase()) || p.groupLabel.toLowerCase().includes(searchTerm.toLowerCase()) || (p.description || "").toLowerCase().includes(searchTerm.toLowerCase());
			const matchesSystem = activeSystemFilter === "all" || p.system === activeSystemFilter;
			return matchesSearch && matchesSystem;
		});
	}, [
		structuredPerms,
		searchTerm,
		activeSystemFilter
	]);
	const groupedBySystem = (0, import_react.useMemo)(() => {
		const map = {};
		filteredPerms.forEach((p) => {
			if (!map[p.system]) map[p.system] = {
				meta: systemMeta[p.system] || {
					label: p.systemLabel,
					icon: faLayerGroup,
					color: "#6c757d"
				},
				groups: {}
			};
			if (!map[p.system].groups[p.groupLabel]) map[p.system].groups[p.groupLabel] = [];
			map[p.system].groups[p.groupLabel].push(p);
		});
		return map;
	}, [filteredPerms]);
	const filteredUsers = (0, import_react.useMemo)(() => {
		if (!userSearchTerm) return users;
		return users.filter((u) => u.name?.toLowerCase().includes(userSearchTerm.toLowerCase()));
	}, [users, userSearchTerm]);
	const activeUser = users.find((u) => u.id === activeUserId);
	const activeUserRole = roles.find((r) => r.id === activeUser?.roleId);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "d-flex justify-content-center align-items-center py-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "spinner-border text-primary",
			role: "status",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "visually-hidden",
				children: "Loading..."
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "position-relative overflow-hidden rounded-4 p-4 mb-4",
				style: {
					background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
					border: "1px solid rgba(255,255,255,0.08)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "position-absolute",
						style: {
							top: "-40%",
							right: "-8%",
							width: "380px",
							height: "380px",
							background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
							pointerEvents: "none"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "position-absolute",
						style: {
							bottom: "-30%",
							left: "-5%",
							width: "280px",
							height: "280px",
							background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
							pointerEvents: "none"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "position-relative d-flex flex-wrap align-items-center justify-content-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex align-items-center justify-content-center rounded-3 flex-shrink-0",
								style: {
									width: "48px",
									height: "48px",
									background: "linear-gradient(135deg, #4F46E5, #6366F1)",
									boxShadow: "0 8px 24px rgba(79,70,229,0.35)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faShield,
									className: "text-white",
									style: { fontSize: "20px" }
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "fw-bold text-white mb-1",
								style: { letterSpacing: "-0.02em" },
								children: "Permissions Control Center"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-0",
								style: {
									color: "rgba(255,255,255,0.55)",
									fontSize: "0.8125rem"
								},
								children: [
									"Manage granular access across ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold text-white",
										children: structuredPerms.length
									}),
									" features in ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold text-white",
										children: Object.keys(FEATURE_REGISTRY).length
									}),
									" systems"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex gap-2",
							children: isDirty && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn rounded-pill px-4 d-flex align-items-center gap-2 border-0",
								style: {
									background: "rgba(255,255,255,0.08)",
									color: "rgba(255,255,255,0.8)"
								},
								onClick: handleReset,
								disabled: saving,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faRotateLeft }), " Reset"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm border-0",
								style: {
									background: "linear-gradient(135deg, #4F46E5, #6366F1)",
									color: "white"
								},
								onClick: handleSave,
								disabled: saving,
								children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner-border spinner-border-sm" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSave }), " Save Changes"] })
							})] })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "position-relative d-flex flex-wrap gap-2 mt-3 pt-3",
						style: { borderTop: "1px solid rgba(255,255,255,0.06)" },
						children: [
							{
								label: "FEATURES",
								value: structuredPerms.length,
								color: "#4F46E5"
							},
							{
								label: "SYSTEMS",
								value: new Set([
									...Object.keys(FEATURE_REGISTRY),
									"sidebar",
									"systems"
								]).size,
								color: "#06b6d4"
							},
							{
								label: "ROLES",
								value: roles.length,
								color: "#10b981"
							},
							{
								label: "USERS",
								value: users.length,
								color: "#f59e0b"
							}
						].map((metric) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2 px-3 py-1 rounded-pill",
							style: { background: "rgba(255,255,255,0.04)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									color: "rgba(255,255,255,0.35)",
									fontSize: "0.6875rem",
									fontWeight: 600,
									letterSpacing: "0.04em"
								},
								children: metric.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "fw-bold",
								style: {
									color: metric.color,
									fontSize: "0.875rem"
								},
								children: metric.value
							})]
						}, metric.label))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm mb-4 no-hover",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-body p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3 align-items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-light p-1 rounded-pill border d-flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: `btn btn-sm rounded-pill flex-grow-1 px-3 d-flex align-items-center justify-content-center gap-2 ${targetMode === "roles" ? "btn-dark shadow-sm" : "btn-light border-0"}`,
										onClick: () => {
											setTargetMode("roles");
											setViewMode("list");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faShield }), " Roles"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: `btn btn-sm rounded-pill flex-grow-1 px-3 d-flex align-items-center justify-content-center gap-2 ${targetMode === "users" ? "btn-dark shadow-sm" : "btn-light border-0"}`,
										onClick: () => {
											setTargetMode("users");
											setViewMode("card");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faUsers }), " Users"]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "input-group rounded-pill overflow-hidden bg-light border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "input-group-text bg-transparent border-0 text-muted px-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control bg-transparent border-0 shadow-none",
										placeholder: "Search features...",
										value: searchTerm,
										onChange: (e) => setSearchTerm(e.target.value)
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "position-relative",
									ref: filterDropdownRef,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-sm d-flex align-items-center gap-2 w-100 rounded-pill border bg-light px-3 py-2",
										onClick: () => setFilterDropdownOpen(!filterDropdownOpen),
										style: { transition: "all 0.2s ease" },
										children: [
											activeSystemFilter === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faLayerGroup,
												className: "text-muted",
												size: "sm"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: systemMeta[activeSystemFilter]?.icon || faLayerGroup,
												size: "sm",
												style: { color: systemMeta[activeSystemFilter]?.color }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex-grow-1 text-start small fw-medium",
												children: activeSystemFilter === "all" ? "All Systems" : systemMeta[activeSystemFilter]?.label || activeSystemFilter
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faChevronDown,
												size: "xs",
												className: "text-muted",
												style: {
													transform: filterDropdownOpen ? "rotate(180deg)" : "none",
													transition: "transform 0.2s ease"
												}
											})
										]
									}), filterDropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "position-absolute w-100 mt-1 rounded-3 shadow-lg border bg-white overflow-hidden",
										style: {
											zIndex: 1080,
											minWidth: "180px"
										},
										children: [{
											key: "all",
											label: "All Systems",
											icon: faLayerGroup,
											color: "#6c757d"
										}, ...Object.entries(systemMeta).map(([k, m]) => ({
											key: k,
											label: m.label,
											icon: m.icon,
											color: m.color
										}))].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [idx > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { borderTop: "1px solid #f1f5f9" } }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: `d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 bg-transparent`,
											style: {
												fontSize: "0.8125rem",
												fontWeight: activeSystemFilter === item.key ? 600 : 400,
												color: activeSystemFilter === item.key ? "#0f172a" : "#475569",
												background: activeSystemFilter === item.key ? "#f8fafc" : "transparent",
												transition: "all 0.12s ease"
											},
											onMouseEnter: (e) => {
												e.currentTarget.style.background = "#f1f5f9";
											},
											onMouseLeave: (e) => {
												e.currentTarget.style.background = activeSystemFilter === item.key ? "#f8fafc" : "transparent";
											},
											onClick: () => {
												setActiveSystemFilter(item.key);
												setFilterDropdownOpen(false);
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: item.icon,
													size: "sm",
													style: {
														color: item.color,
														opacity: activeSystemFilter === item.key ? 1 : .7
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "flex-grow-1 text-start",
													children: item.label
												}),
												activeSystemFilter === item.key && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faCheck,
													size: "xs",
													className: "text-primary"
												})
											]
										})] }, item.key))
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-end align-items-center gap-2",
									children: [
										targetMode === "roles" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-light p-1 rounded-pill border d-flex",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: `btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${viewMode === "list" ? "btn-dark shadow-sm" : "btn-light border-0"}`,
												onClick: () => setViewMode("list"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faList }), " Matrix"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: `btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${viewMode === "card" ? "btn-dark shadow-sm" : "btn-light border-0"}`,
												onClick: () => setViewMode("card"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faThLarge }), " Cards"]
											})]
										}),
										targetMode === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "input-group input-group-sm rounded-pill overflow-hidden bg-light border",
											style: { width: "200px" },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "input-group-text bg-transparent border-0 text-muted px-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faSearch,
													size: "sm"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control bg-transparent border-0 shadow-none",
												placeholder: "Search user...",
												value: userSearchTerm,
												onChange: (e) => setUserSearchTerm(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "badge bg-light text-dark border rounded-pill px-3 py-2 d-flex align-items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faInfoCircle,
													size: "sm"
												}),
												" ",
												targetMode === "roles" ? `${roles.length} roles` : `${users.length} users`
											]
										})
									]
								})
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "d-flex align-items-center gap-3 overflow-auto pb-2",
					style: { scrollbarWidth: "none" },
					children: targetMode === "roles" ? viewMode === "card" && roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `btn rounded-4 px-4 py-3 d-flex flex-column align-items-center gap-2 border-2 ${activeRoleId === role.id ? "bg-dark text-white border-dark shadow" : "bg-white text-dark border-light shadow-sm"}`,
						style: { minWidth: "140px" },
						onClick: () => setActiveRoleId(role.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-2 rounded-circle ${activeRoleId === role.id ? "bg-white text-dark" : ""}`,
								style: {
									backgroundColor: activeRoleId !== role.id ? `${role.color || "#0d6efd"}15` : "",
									color: activeRoleId !== role.id ? role.color || "#0d6efd" : ""
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faShield,
									size: "lg"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "fw-bold small text-uppercase",
								children: role.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "small",
								style: {
									fontSize: "10px",
									color: activeRoleId === role.id ? "rgba(255,255,255,0.7)" : "#6c757d"
								},
								children: [
									matrixState[role.id]?.length || 0,
									" / ",
									structuredPerms.length
								]
							})
						]
					}, role.id)) : filteredUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `btn rounded-4 px-3 py-3 d-flex align-items-center gap-3 border-2 ${activeUserId === user.id ? "bg-dark text-white border-dark shadow" : "bg-white text-dark border-light shadow-sm"}`,
						style: { minWidth: "220px" },
						onClick: () => setActiveUserId(user.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `rounded-circle d-flex align-items-center justify-content-center fw-bold`,
								style: {
									width: "40px",
									height: "40px",
									backgroundColor: activeUserId === user.id ? "white" : `${systemMeta[user.role?.toLowerCase()]?.color || "#0d6efd"}15`,
									color: activeUserId === user.id ? "#000" : systemMeta[user.role?.toLowerCase()]?.color || "#0d6efd"
								},
								children: user.name?.charAt(0) || "?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "mb-0 fw-bold small text-truncate",
									style: { maxWidth: "120px" },
									children: user.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-0 small",
									style: {
										fontSize: "10px",
										color: activeUserId === user.id ? "rgba(255,255,255,0.7)" : "#6c757d"
									},
									children: user.role || "N/A"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ms-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-circle",
									style: {
										width: "8px",
										height: "8px",
										backgroundColor: user.isOnline ? "#198754" : "#adb5bd"
									}
								})
							})
						]
					}, user.id))
				})
			}),
			viewMode === "list" && targetMode === "roles" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm overflow-hidden ${isDark ? "bg-dark-card" : ""}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-responsive",
					style: { maxHeight: "70vh" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "table table-hover align-middle mb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: `sticky-top shadow-sm ${isDark ? "bg-dark-header" : "bg-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: `ps-4 py-4 ${isDark ? "bg-dark-header" : "bg-white"}`,
								style: {
									minWidth: "320px",
									borderBottom: isDark ? "2px solid #1e293b" : "2px solid #f1f5f9"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faShield,
										className: "text-primary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `fw-bold ${isDark ? "text-light" : ""}`,
										children: "System / Feature"
									})]
								})
							}), roles.map((role) => {
								const isColHovered = hoveredCol === role.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: `text-center py-4 transition-all ${isDark ? "bg-dark-header" : "bg-white"} ${isColHovered ? "matrix-col-header-hovered" : ""}`,
									style: {
										minWidth: "110px",
										borderBottom: isDark ? "2px solid #1e293b" : "2px solid #f1f5f9",
										transition: "all 0.2s ease",
										transform: isColHovered ? "scale(1.05) translateY(-2px)" : "none"
									},
									onMouseEnter: () => setHoveredCol(role.id),
									onMouseLeave: () => setHoveredCol(null),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex flex-column align-items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-2 rounded-circle mb-1",
											style: {
												backgroundColor: `${role.color || "#4F46E5"}15`,
												color: role.color || "#4F46E5",
												boxShadow: isColHovered ? `0 0 10px ${role.color || "#4F46E5"}40` : "none"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faShield })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "small fw-bold text-uppercase",
											style: { letterSpacing: "0.05em" },
											children: role.name
										})]
									})
								}, role.id);
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Object.entries(groupedBySystem).map(([systemKey, system]) => {
							const isCollapsed = collapsedSystems[systemKey];
							const allGroupPerms = Object.values(system.groups).flat();
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: isDark ? "bg-dark" : "bg-light-subtle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: roles.length + 1,
									className: "p-0 border-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `d-flex align-items-center justify-content-between px-4 py-3 border-bottom cursor-pointer ${isDark ? "bg-dark" : "bg-light-subtle"}`,
										onClick: () => toggleCollapseSystem(systemKey),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: isCollapsed ? faChevronRight : faChevronDown,
													className: "text-muted",
													size: "sm"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "d-flex align-items-center justify-content-center rounded",
													style: {
														width: "32px",
														height: "32px",
														backgroundColor: `${system.meta.color}15`,
														color: system.meta.color
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: system.meta.icon,
														size: "sm"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
													className: `mb-0 fw-bold ${isDark ? "text-light" : ""}`,
													children: system.meta.label
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `badge rounded-pill small px-2 ${isDark ? "bg-dark text-light border border-secondary" : "bg-white text-dark border"}`,
													children: [allGroupPerms.length, " features"]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: `btn btn-sm rounded-pill px-3 ${isDark ? "btn-outline-light" : "btn-white border"}`,
												onClick: (e) => {
													e.stopPropagation();
													toggleSystemForTarget(activeRoleId, allGroupPerms, true);
												},
												children: "Enable All"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: `btn btn-sm rounded-pill px-3 ${isDark ? "btn-outline-light" : "btn-white border"}`,
												onClick: (e) => {
													e.stopPropagation();
													toggleSystemForTarget(activeRoleId, allGroupPerms, false);
												},
												children: "Disable All"
											})]
										})]
									})
								})
							}), !isCollapsed && Object.entries(system.groups).map(([groupLabel, perms]) => {
								const groupKey = `${systemKey}_${groupLabel}`;
								const isGroupCollapsed = collapsedGroups[groupKey];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: roles.length + 1,
									className: "p-0 border-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `d-flex align-items-center justify-content-between px-5 py-2 border-bottom cursor-pointer ${isDark ? "bg-dark-card" : "bg-white"}`,
										onClick: () => toggleCollapseGroup(groupKey),
										style: { cursor: "pointer" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: isGroupCollapsed ? faChevronRight : faChevronDown,
													className: "text-muted",
													size: "xs"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faLayerGroup,
													className: "text-muted",
													size: "sm"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `small fw-semibold ${isDark ? "text-light" : ""}`,
													children: groupLabel
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `badge rounded-pill ${isDark ? "bg-dark text-light border border-secondary" : "bg-light text-dark"}`,
													style: { fontSize: "10px" },
													children: perms.length
												})
											]
										})
									})
								}) }), !isGroupCollapsed && perms.map((p) => {
									const permNumericId = resolvePermissionId(p.id);
									const isRowHovered = hoveredRow === p.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: `border-bottom transition-all ${isRowHovered ? "matrix-row-hovered" : ""}`,
										onMouseEnter: () => setHoveredRow(p.id),
										onMouseLeave: () => setHoveredRow(null),
										style: { transition: "all 0.2s ease" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "ps-5 py-3 border-0",
											style: { paddingLeft: "4rem !important" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "small fw-semibold d-block",
												children: highlightText(p.name, searchTerm)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted d-block",
												style: { fontSize: "11px" },
												children: highlightText(p.description, searchTerm)
											})] })
										}), roles.map((role) => {
											const isChecked = matrixState[role.id]?.includes(permNumericId);
											const isColHovered = hoveredCol === role.id;
											const isCellHovered = isRowHovered && isColHovered;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: `text-center py-3 border-0 transition-all ${isColHovered ? "matrix-col-hovered" : ""} ${isCellHovered ? "matrix-cell-hovered" : ""}`,
												onMouseEnter: () => setHoveredCol(role.id),
												onMouseLeave: () => setHoveredCol(null),
												style: {
													transition: "all 0.2s ease",
													backgroundColor: isCellHovered ? "rgba(79, 70, 229, 0.08)" : isColHovered ? "rgba(79, 70, 229, 0.03)" : "transparent"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "form-check form-check-inline m-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														className: "form-check-input cursor-pointer custom-matrix-checkbox",
														type: "checkbox",
														checked: isChecked || false,
														onChange: () => togglePermission(role.id, p.id),
														style: {
															width: "1.4rem",
															height: "1.4rem",
															borderColor: isChecked ? role.color || "#4f46e5" : "#cbd5e1",
															backgroundColor: isChecked ? role.color || "#4f46e5" : "transparent",
															borderRadius: "6px",
															cursor: "pointer",
															boxShadow: isChecked ? `0 0 8px ${role.color || "#4f46e5"}40` : "none",
															transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
														}
													})
												})
											}, role.id);
										})]
									}, p.id);
								})] }, groupKey);
							})] }, systemKey);
						}) })]
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [targetMode === "users" && activeUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-12 mb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `alert border-0 rounded-4 shadow-sm d-flex align-items-center gap-3 p-4 ${isDark ? "bg-dark-card border-secondary" : "alert-info"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 bg-info bg-opacity-10 rounded-circle text-info",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faUserCheck,
								size: "lg"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
							className: "mb-1 fw-bold",
							children: ["Individual Overrides for ", activeUser.name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-0 small text-muted",
							children: [
								"Permissions toggled here grant access to ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeUser.name }),
								" regardless of their role (",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: activeUser.role }),
								").",
								activeUser.role === "Admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-danger ms-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faInfoCircle }), " Admin users already have all permissions."]
								})
							]
						})] })]
					})
				}), Object.entries(groupedBySystem).map(([systemKey, system]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm mb-3 ${isDark ? "bg-dark-card" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `card-header d-flex align-items-center justify-content-between px-4 py-3 ${isDark ? "bg-dark border-secondary text-light" : "bg-transparent border-bottom"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex align-items-center justify-content-center rounded",
									style: {
										width: "36px",
										height: "36px",
										backgroundColor: `${system.meta.color}15`,
										color: system.meta.color
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: system.meta.icon })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: `fw-bold mb-0 ${isDark ? "text-light" : ""}`,
									children: system.meta.label
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "dropdown",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `btn btn-sm rounded-pill px-3 dropdown-toggle ${isDark ? "btn-outline-light" : "btn-light"}`,
									type: "button",
									"data-bs-toggle": "dropdown",
									children: "Bulk"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "dropdown-menu shadow border-0 rounded-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "dropdown-item small",
										onClick: () => toggleSystemForTarget(targetMode === "roles" ? activeRoleId : activeUserId, Object.values(system.groups).flat(), true),
										children: "Enable All"
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "dropdown-item small text-danger",
										onClick: () => toggleSystemForTarget(targetMode === "roles" ? activeRoleId : activeUserId, Object.values(system.groups).flat(), false),
										children: "Disable All"
									}) })]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-body p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row g-3",
								children: Object.entries(system.groups).map(([groupLabel, perms]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-xl-4 col-lg-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `card h-100 ${isDark ? "bg-dark-card border-secondary" : "border"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `card-header px-3 py-2 ${isDark ? "bg-dark border-secondary" : "bg-transparent border-bottom"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faLayerGroup,
														className: "text-muted",
														size: "sm"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `small fw-semibold ${isDark ? "text-light" : ""}`,
														children: groupLabel
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `badge rounded-pill ms-auto ${isDark ? "bg-dark text-light border border-secondary" : "bg-light text-dark"}`,
														style: { fontSize: "10px" },
														children: perms.length
													})
												]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "card-body p-2",
											children: perms.map((p) => {
												const permNumericId = resolvePermissionId(p.id);
												const isChecked = targetMode === "roles" ? matrixState[activeRoleId]?.includes(permNumericId) : userOverrides[activeUserId]?.includes(permNumericId);
												const isInherited = targetMode === "users" && activeUserRole?.permissions?.some((rp) => rp.id === permNumericId);
												let cardBgClass = isDark ? "bg-dark border-secondary" : "bg-light border";
												let borderStyle = isDark ? "1px solid #334155" : "1px solid #e2e8f0";
												if (isInherited) {
													cardBgClass = "bg-success bg-opacity-10 border-success border-opacity-20";
													borderStyle = "1px solid rgba(25, 135, 84, 0.15)";
												} else if (isChecked) {
													cardBgClass = "bg-primary bg-opacity-10 border-primary border-opacity-20";
													borderStyle = "1px solid rgba(13, 110, 253, 0.15)";
												}
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 mb-2 cursor-pointer transition-all hover-scale ${cardBgClass}`,
													style: {
														cursor: isInherited ? "default" : "pointer",
														border: borderStyle,
														boxShadow: isChecked && !isInherited ? "0 4px 12px rgba(13, 110, 253, 0.08)" : "none",
														transition: "all 0.2s ease"
													},
													onClick: () => !isInherited && togglePermission(targetMode === "roles" ? activeRoleId : activeUserId, p.id),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0 me-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "small fw-semibold d-block text-dark-emphasis",
																children: [
																	highlightText(p.name, searchTerm),
																	isInherited && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "badge bg-success bg-opacity-75 text-white ms-1 fw-bold align-middle",
																		style: {
																			fontSize: "8px",
																			letterSpacing: "0.04em"
																		},
																		children: "Inherited"
																	}),
																	isChecked && !isInherited && targetMode === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "badge bg-primary bg-opacity-75 text-white ms-1 fw-bold align-middle",
																		style: {
																			fontSize: "8px",
																			letterSpacing: "0.04em"
																		},
																		children: "Override"
																	})
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
																className: "text-muted d-block text-truncate mt-0.5",
																style: {
																	maxWidth: "280px",
																	fontSize: "10px"
																},
																children: highlightText(p.description, searchTerm)
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
																className: "text-muted mt-1 d-inline-block font-monospace",
																style: {
																	fontSize: "9px",
																	background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
																	padding: "1px 4px",
																	borderRadius: "3px"
																},
																children: p.id
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "form-check form-switch m-0 flex-shrink-0",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															className: "form-check-input cursor-pointer",
															type: "checkbox",
															checked: isChecked || isInherited || false,
															disabled: isInherited,
															readOnly: true,
															style: {
																cursor: isInherited ? "default" : "pointer",
																width: "1.8em",
																height: "0.9em"
															}
														})
													})]
												}, p.id);
											})
										})]
									})
								}, groupLabel))
							})
						})]
					})
				}, systemKey))]
			}),
			Object.keys(groupedBySystem).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faShield,
					className: "text-muted opacity-25 mb-3",
					style: { fontSize: "3rem" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "No features match your search."
				})]
			}),
			isDirty && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-lg border rounded-4 p-3 d-flex align-items-center justify-content-between gap-4 animate-slide-up",
				style: {
					zIndex: 1050,
					width: "450px",
					maxWidth: "90vw",
					border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
					boxShadow: isDark ? "0 10px 40px rgba(0,0,0,0.5)" : "0 10px 40px rgba(0,0,0,0.15)",
					background: isDark ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.92)",
					backdropFilter: "blur(12px)"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-circle bg-warning bg-opacity-10 text-warning p-2.5 d-flex align-items-center justify-content-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faInfoCircle,
							className: "animate-pulse",
							size: "sm"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `fw-bold d-block ${isDark ? "text-light" : "text-dark"}`,
						style: { fontSize: "13px" },
						children: "Unsaved Changes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted small",
						style: { fontSize: "11px" },
						children: "Permissions have been modified. Commit your updates now."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: `btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${isDark ? "btn-outline-light" : "btn-outline-secondary"}`,
						style: { fontSize: "12px" },
						onClick: handleReset,
						disabled: saving,
						children: "Discard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: `btn btn-sm rounded-pill px-3 py-1.5 fw-semibold shadow-sm ${isDark ? "btn-light text-dark" : "btn-dark"}`,
						style: { fontSize: "12px" },
						onClick: handleSave,
						disabled: saving,
						children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner-border spinner-border-sm" }) : "Save changes"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .bg-light-subtle { background-color: #f8fafc !important; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .bg-success-subtle { background-color: #f0fdf4 !important; }
        .cursor-pointer { cursor: pointer; }
        .btn-white { background: white; color: #64748b; }
        .btn-white:hover { background: #f1f5f9; color: #0d6efd; border-color: #0d6efd !important; }
        .sticky-top { top: 0; }
        
        /* Grid matrix highlights */
        .matrix-row-hovered {
          background-color: rgba(79, 70, 229, 0.02) !important;
        }
        .matrix-col-hovered {
          background-color: rgba(79, 70, 229, 0.015) !important;
        }
        .matrix-col-header-hovered {
          background-color: rgba(79, 70, 229, 0.04) !important;
        }
        .matrix-cell-hovered {
          background-color: rgba(79, 70, 229, 0.06) !important;
        }
        
        /* Scale hover effects */
        .hover-scale {
          transition: all 0.2s ease;
        }
        .hover-scale:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .no-hover:hover { transform: none !important; box-shadow: var(--bs-card-box-shadow, inherit) !important; }

        /* Animations */
        @keyframes slideUp {
          from { transform: translate(-50%, 40px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pulse {
          animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        ${isDark ? `
          .bg-light-subtle { background-color: #1e293b !important; }
          .bg-dark-header { background-color: #0f172a !important; }
          .bg-dark-card { background-color: #1e293b !important; }
          .table { color: #cbd5e1; }
          .table-hover tbody tr:hover { color: #e2e8f0; background-color: rgba(255,255,255,0.02); }
          .table td, .table th { border-color: #334155; }
          .table > :not(caption) > * > * { border-bottom-color: #334155; }
          .btn-white { background: #1e293b; color: #94a3b8; border-color: #334155; }
          .btn-white:hover { background: #334155; color: #e2e8f0; border-color: #6366f1 !important; }
          .form-check-input { background-color: #334155; border-color: #475569; }
          .form-check-input:checked { background-color: #6366f1; border-color: #6366f1; }
          .hover-scale:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
          .dropdown-menu { background-color: #1e293b; border-color: #334155; }
          .dropdown-item { color: #cbd5e1; }
          .dropdown-item:hover { background-color: #334155; color: #f1f5f9; }
        ` : ""}
      ` })
		]
	});
};
//#endregion
export { Permissions as default };
