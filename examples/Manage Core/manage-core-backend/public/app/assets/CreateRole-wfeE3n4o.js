import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, bl as useApp, ru as require_react } from "./ai-BHgPkVLC.js";
import { Dt as FiUsers, L as FiActivity, P as listUsers, U as FiBriefcase, V as FiArrowRight, Wt as useNavigate, dt as FiMessageSquare, ft as FiMoreVertical, gt as FiRefreshCw, ht as FiPlus, it as FiGrid, lt as FiMail, nt as FiFilter, pt as FiPhone, rt as FiGlobe, st as FiList, vt as FiSearch } from "./superadmin-Cn5Mt1aQ.js";
import { i as listRoles, t as bulkUpdateUserRoles } from "./roles-CNnFlAEt.js";
//#region src/pages/Permissions&Modules/CreateRole.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var CreateRole = () => {
	const navigate = useNavigate();
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [selectedUsers, setSelectedUsers] = (0, import_react.useState)([]);
	const [bulkRole, setBulkRole] = (0, import_react.useState)("");
	const [updatingBulk, setUpdatingBulk] = (0, import_react.useState)(false);
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const loadData = async () => {
		setLoading(true);
		try {
			const [rolesData, usersData] = await Promise.all([listRoles(), listUsers()]);
			setRoles(rolesData || []);
			setUsers(usersData || []);
		} catch (err) {
			addNotification("Failed to synchronize personnel repository", "danger");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	const handleAddRole = () => navigate("/admin-dashboard/roles/add");
	const toggleUserSelection = (userId) => {
		setSelectedUsers((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);
	};
	const handleSelectAll = (e) => {
		if (e.target.checked) setSelectedUsers(filteredUsers.map((u) => u.id));
		else setSelectedUsers([]);
	};
	const handleBulkUpdate = async () => {
		if (!bulkRole) {
			addNotification("Target protocol specification mandatory", "warning");
			return;
		}
		setUpdatingBulk(true);
		try {
			await bulkUpdateUserRoles(selectedUsers, bulkRole);
			addNotification(`Access protocols updated for ${selectedUsers.length} personnel`, "success");
			setSelectedUsers([]);
			setBulkRole("");
			loadData();
		} catch (err) {
			addNotification(err.message || "Update failed", "danger");
		} finally {
			setUpdatingBulk(false);
		}
	};
	const filteredUsers = (0, import_react.useMemo)(() => {
		return users.filter((user) => (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) || (user.role || "").toLowerCase().includes(searchTerm.toLowerCase()) || (user.empId || "").toLowerCase().includes(searchTerm.toLowerCase()));
	}, [users, searchTerm]);
	const textColor = isDark ? "#f8fafc" : "#1e293b";
	const cardBg = isDark ? "#111827" : "#ffffff";
	const subBg = isDark ? "#1f2937" : "#f9fafb";
	const borderColor = isDark ? "#374151" : "#f1f5f9";
	const PersonnelCard = ({ user }) => {
		const roleColor = roles.find((r) => r.name === user.role)?.color || "#4F46E5";
		const isSelected = selectedUsers.includes(user.id);
		const performance = 85;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-xl-4 col-lg-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm h-100 personnel-premium-card transition-all ${isSelected ? "card-selected-pro" : ""}`,
				style: {
					borderRadius: "28px",
					background: cardBg,
					cursor: "pointer"
				},
				onClick: () => toggleUserSelection(user.id),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex justify-content-between align-items-start mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "avatar-wrapper position-relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "avatar-pro-lg rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm",
										style: {
											width: "64px",
											height: "64px",
											background: `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)`,
											fontSize: "1.2rem"
										},
										children: user.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: user.avatar,
											className: "rounded-circle w-100 h-100 object-fit-cover",
											alt: ""
										}) : (user.name || "U").charAt(0)
									}), user.isOnline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "status-indicator-pro online position-absolute border-3",
										style: {
											width: 18,
											height: 18
										}
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold mb-0",
										style: { color: textColor },
										children: user.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "extra-small text-muted fw-bold text-uppercase",
										style: { letterSpacing: "0.5px" },
										children: user.role
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "extra-small text-muted mt-1",
										children: user.empId || "SYSTEM-001"
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "form-check custom-checkbox-pro",
								onClick: (e) => e.stopPropagation(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "form-check-input shadow-none",
									type: "checkbox",
									checked: isSelected,
									onChange: () => toggleUserSelection(user.id)
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-2 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-4",
									style: { background: subBg },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "extra-small text-muted mb-1 fw-bold text-uppercase",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiBriefcase, {
											size: 10,
											className: "me-1"
										}), " Dept"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "small fw-bold text-truncate",
										style: { color: textColor },
										children: user.organization || "Corporate"
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-4",
									style: { background: subBg },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "extra-small text-muted mb-1 fw-bold text-uppercase",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiGlobe, {
											size: 10,
											className: "me-1"
										}), " Locale"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "small fw-bold",
										style: { color: textColor },
										children: user.city || "Global"
									})]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "performance-track mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex justify-content-between align-items-center mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "extra-small fw-bold text-muted text-uppercase",
									children: "Performance Capacity"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "extra-small fw-bold",
									style: { color: roleColor },
									children: [performance, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "progress rounded-pill",
								style: {
									height: "6px",
									background: isDark ? "#334155" : "#f1f5f9"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress-bar rounded-pill",
									style: {
										width: `${performance}%`,
										backgroundColor: roleColor
									}
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between pt-3 border-top mt-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-icon-pro btn-sm rounded-circle",
										title: "Email Personnel",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiMail, { size: 14 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-icon-pro btn-sm rounded-circle",
										title: "Chat Interface",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiMessageSquare, { size: 14 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-icon-pro btn-sm rounded-circle",
										title: "Telephony",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiPhone, { size: 14 })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-link text-primary text-decoration-none extra-small fw-bold d-flex align-items-center gap-1",
								children: ["VIEW PROFILE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiArrowRight, { size: 12 })]
							})]
						})
					]
				})
			})
		});
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex flex-column justify-content-center align-items-center",
		style: { height: "500px" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "spinner-grow text-primary",
			role: "status",
			style: {
				width: "3rem",
				height: "3rem"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-muted extra-small fw-bold text-uppercase tracking-widest",
			children: "Initialising Personnel Directory..."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-fluid py-4 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					style: {
						color: textColor,
						letterSpacing: "-0.5px"
					},
					children: "Access Control & Personnel Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted small mb-0 fw-medium",
					children: "Global directory for security provisioning and organizational role assignment."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "view-toggle-pro p-1 rounded-pill border d-flex gap-1",
						style: {
							background: isDark ? "#111827" : "#fff",
							borderColor
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: `btn btn-sm rounded-pill px-3 transition-all ${viewMode === "list" ? "bg-primary text-white shadow-sm" : "text-muted"}`,
							onClick: () => setViewMode("list"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiList, { size: 16 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: `btn btn-sm rounded-pill px-3 transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-sm" : "text-muted"}`,
							onClick: () => setViewMode("grid"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiGrid, { size: 16 })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4 fw-bold shadow-sm hover-lift",
						style: { height: "46px" },
						onClick: handleAddRole,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiPlus, { size: 20 }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Define New Role" })
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card border-0 shadow-lg-soft overflow-hidden",
				style: {
					borderRadius: "32px",
					background: cardBg
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 border-bottom",
						style: { borderColor },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 align-items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "search-container position-relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiSearch, {
										className: "position-absolute text-muted",
										style: {
											top: "50%",
											left: "1.25rem",
											transform: "translateY(-50%)",
											zIndex: 1
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control ps-5 border-0 rounded-4 shadow-none",
										style: {
											background: subBg,
											height: "52px",
											color: textColor,
											fontSize: "0.95rem"
										},
										placeholder: "Search by name, identity, email or role...",
										value: searchTerm,
										onChange: (e) => setSearchTerm(e.target.value)
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-6 text-md-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex gap-2 justify-content-md-end",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-light rounded-4 px-3 d-flex align-items-center gap-2 border",
										style: { height: "52px" },
										onClick: loadData,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiRefreshCw, { className: loading ? "spin" : "" }),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "small fw-bold",
												children: "Sync"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-light rounded-4 px-3 d-flex align-items-center gap-2 border",
										style: { height: "52px" },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiFilter, {}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "small fw-bold",
												children: "Filter"
											})
										]
									})]
								})
							})]
						})
					}),
					selectedUsers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 bg-primary bg-opacity-10 border-bottom border-primary border-opacity-25 animate-slide-down",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container-fluid",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex flex-wrap align-items-center justify-content-between gap-3 px-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "selection-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold",
										style: {
											width: 32,
											height: 32,
											fontSize: "13px"
										},
										children: selectedUsers.length
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-bold small",
										style: { color: textColor },
										children: "Personnel Selected"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "extra-small text-muted fw-medium text-uppercase",
										children: "Mass Security Protocol Update"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "form-select border-0 rounded-3 shadow-sm px-4",
											style: {
												width: "220px",
												height: "42px",
												fontSize: "13px",
												background: isDark ? "#1f2937" : "#fff"
											},
											value: bulkRole,
											onChange: (e) => setBulkRole(e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Target Protocol..."
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Admin",
													children: "Admin"
												}),
												roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: r.name,
													children: r.name
												}, r.id))
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-primary rounded-pill px-4 fw-bold shadow-sm",
											style: {
												height: "42px",
												fontSize: "13px"
											},
											onClick: handleBulkUpdate,
											disabled: updatingBulk,
											children: updatingBulk ? "Processing..." : "Assign Role"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-link text-muted text-decoration-none small fw-bold px-3",
											onClick: () => setSelectedUsers([]),
											children: "Dismiss"
										})
									]
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "main-view-container",
						style: { background: viewMode === "grid" ? subBg : "transparent" },
						children: viewMode === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-hover align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "text-muted extra-small text-uppercase fw-bold border-bottom",
									style: { background: subBg },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											style: { width: "60px" },
											className: "ps-4 py-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "form-check custom-checkbox-pro",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "form-check-input shadow-none",
													type: "checkbox",
													onChange: handleSelectAll,
													checked: selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-4",
											children: "Personnel Identity"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-4",
											children: "Security Protocol"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-4",
											children: "Contact Gateway"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-4",
											children: "System Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-4 pe-4 text-end",
											children: "Management"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "6",
									className: "text-center py-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-3 opacity-20",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUsers, { size: 64 })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
											className: "fw-bold",
											style: { color: textColor },
											children: "No personnel found"
										})]
									})
								}) }) : filteredUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: `${selectedUsers.includes(user.id) ? "row-selected" : ""}`,
									onClick: () => toggleUserSelection(user.id),
									style: { cursor: "pointer" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "ps-4 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "form-check custom-checkbox-pro",
												onClick: (e) => e.stopPropagation(),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "form-check-input shadow-none",
													type: "checkbox",
													checked: selectedUsers.includes(user.id),
													onChange: () => toggleUserSelection(user.id)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "avatar-wrapper position-relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "avatar-pro rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm",
													style: {
														width: "48px",
														height: "48px",
														background: `linear-gradient(135deg, ${roles.find((r) => r.name === user.role)?.color || "#4F46E5"}, #4F46E5dd)`
													},
													children: user.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: user.avatar,
														className: "rounded-circle w-100 h-100 object-fit-cover",
														alt: ""
													}) : (user.name || "U").charAt(0)
												}), user.isOnline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "status-indicator-pro online position-absolute" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "fw-bold small mb-0",
												style: { color: textColor },
												children: user.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "extra-small text-muted fw-medium d-flex align-items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiActivity, { size: 10 }),
													" ",
													user.empId || "SYS-USR",
													" • ",
													user.city || "Global"
												]
											})] })]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge rounded-pill px-3 py-2 fw-bold",
											style: {
												backgroundColor: `${roles.find((r) => r.name === user.role)?.color || "#4F46E5"}15`,
												color: roles.find((r) => r.name === user.role)?.color || "#4F46E5",
												fontSize: "10px"
											},
											children: (user.role || "MEMBER").toUpperCase()
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "extra-small fw-bold",
											style: { color: textColor },
											children: user.email
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: user.isOnline ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 extra-small fw-bold d-inline-flex align-items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pulse-dot" }), " ACTIVE"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "badge bg-secondary bg-opacity-10 text-muted rounded-pill px-3 py-2 extra-small fw-bold",
											children: "OFFLINE"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "pe-4 text-end",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-icon-pro rounded-circle",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiMoreVertical, { size: 14 })
											})
										})
									]
								}, user.id)) })]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row g-4",
								children: filteredUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-12 text-center py-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-3 opacity-20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUsers, { size: 64 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "fw-bold",
										style: { color: textColor },
										children: "No personnel found"
									})]
								}) : filteredUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonnelCard, { user }, user.id))
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-light bg-opacity-50 border-top d-flex justify-content-between align-items-center",
						style: { borderColor },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "extra-small text-muted fw-bold",
							children: [
								"Showing ",
								filteredUsers.length,
								" of ",
								users.length,
								" total entries"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-light btn-sm rounded-3 border px-3 extra-small fw-bold",
								disabled: true,
								children: "Previous"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-light btn-sm rounded-3 border px-3 extra-small fw-bold",
								disabled: true,
								children: "Next"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
        .extra-small { font-size: 11px; }
        .rounded-4 { border-radius: 1rem !important; }
        .shadow-lg-soft { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05) !important; }
        
        .personnel-premium-card:hover { transform: translateY(-8px); box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1) !important; }
        .card-selected-pro { border: 2.5px solid #4f46e5 !important; background: rgba(79, 70, 229, 0.02) !important; }
        
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-slide-down { animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        .status-indicator-pro { width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; bottom: 0; right: 0; z-index: 2; }
        .status-indicator-pro.online { background-color: #10b981; }
        
        .pulse-dot { width: 6px; height: 6px; background-color: #10b981; border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
            70% { transform: scale(1.2); opacity: 0; box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { transform: scale(1); opacity: 0; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        
        .custom-checkbox-pro .form-check-input { width: 20px; height: 20px; border-radius: 6px; border: 2px solid #e2e8f0; cursor: pointer; transition: all 0.2s ease; }
        .custom-checkbox-pro .form-check-input:checked { background-color: #4f46e5; border-color: #4f46e5; }
        
        .btn-icon-pro { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.2s ease; }
        .btn-icon-pro:hover { background: rgba(0,0,0,0.05); color: #4f46e5; }
        
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2) !important; }
      ` } })
		]
	});
};
//#endregion
export { CreateRole as default };
