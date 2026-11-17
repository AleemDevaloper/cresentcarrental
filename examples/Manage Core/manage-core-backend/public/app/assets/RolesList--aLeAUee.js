import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, bl as useApp, ru as require_react } from "./ai-BHgPkVLC.js";
import { At as FiZap, Ct as FiTrash2, Dt as FiUsers, H as FiAward, P as listUsers, Q as FiCpu, St as FiStar, Tt as FiUser, U as FiBriefcase, Wt as useNavigate, X as FiCommand, Y as FiCode, bt as FiSettings, et as FiEdit2, ft as FiMoreVertical, ht as FiPlus, lt as FiMail, ot as FiKey, pt as FiPhone, rt as FiGlobe, tt as FiEye, ut as FiMessageCircle, xt as FiShield } from "./superadmin-Cn5Mt1aQ.js";
import { i as listRoles, r as deleteRole } from "./roles-CNnFlAEt.js";
//#region src/pages/Permissions&Modules/RolesList.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var RolesList = () => {
	const navigate = useNavigate();
	const { addNotification, confirmDialog } = useApp();
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [activeDropdown, setActiveDropdown] = (0, import_react.useState)(null);
	const availableIcons = {
		FiShield: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, {}),
		FiUser: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUser, {}),
		FiStar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiStar, {}),
		FiBriefcase: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiBriefcase, {}),
		FiCode: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCode, {}),
		FiCpu: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCpu, {}),
		FiSettings: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiSettings, {}),
		FiZap: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiZap, {}),
		FiAward: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiAward, {}),
		FiCommand: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCommand, {}),
		FiGlobe: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiGlobe, {}),
		FiKey: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiKey, {}),
		FiPhone: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiPhone, {}),
		FiPhoneCall: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiPhone, {}),
		FiMail: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiMail, {}),
		FiMessageCircle: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiMessageCircle, {}),
		FiMessageSquare: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiMessageCircle, {})
	};
	const getIcon = (iconName) => {
		return availableIcons[{
			phone: "FiPhone",
			call: "FiPhone",
			mail: "FiMail",
			email: "FiMail",
			chat: "FiMessageCircle",
			message: "FiMessageCircle"
		}[String(iconName || "").toLowerCase()] || iconName] || /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, {});
	};
	(0, import_react.useEffect)(() => {
		loadData();
		const handleClickOutside = () => setActiveDropdown(null);
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);
	const loadData = async () => {
		setLoading(true);
		try {
			const [rolesData, usersData] = await Promise.all([listRoles(), listUsers()]);
			setRoles(rolesData);
			setUsers(usersData);
		} catch (err) {
			addNotification("Failed to load data", "danger");
			console.log(err);
		} finally {
			setLoading(false);
		}
	};
	const userCountByRole = (0, import_react.useMemo)(() => {
		const counts = {};
		users.forEach((user) => {
			const key = user.roleId ? `id:${user.roleId}` : `name:${user.role}`;
			counts[key] = (counts[key] || 0) + 1;
		});
		return counts;
	}, [users]);
	const getUserCount = (role) => userCountByRole[`id:${role.id}`] || userCountByRole[`name:${role.name}`] || 0;
	const handleAddRole = () => {
		navigate("/admin-dashboard/roles/add");
	};
	const handleEditRole = (id) => {
		navigate(`/admin-dashboard/roles/edit/${id}`);
	};
	const handleViewRole = (id) => {
		navigate(`/admin-dashboard/roles/edit/${id}`);
	};
	const handleDeleteRole = async (id) => {
		if (!await confirmDialog({
			title: "Delete Role",
			message: "Are you sure you want to delete this role? This action cannot be undone.",
			variant: "danger",
			confirmLabel: "Yes, Delete"
		})) return;
		try {
			await deleteRole(id);
			addNotification("Role deleted successfully", "success");
			loadData();
		} catch (err) {
			addNotification(err.message, "danger");
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "d-flex justify-content-center align-items-center",
		style: { height: "300px" },
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
		className: "container-fluid py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "row",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-xl-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card border-0 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-4 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "mb-0 fw-bold",
							children: "Roles List"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted small mb-0",
							children: "Manage system roles and their descriptions."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-primary px-4 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm",
							onClick: handleAddRole,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiPlus, {}), " Add New Role"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-body px-4 pb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-4 mt-1",
							children: [
								roles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-12 text-center py-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, {
											size: 48,
											className: "text-light mb-3"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
											className: "text-muted",
											children: "No roles defined yet"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted small",
											children: "Start by creating your first system role."
										})
									]
								}),
								roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6 col-lg-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "role-card p-4 border-0 rounded-4 transition h-100 position-relative overflow-hidden group shadow-sm",
										style: {
											background: "rgba(255, 255, 255, 0.8)",
											backdropFilter: "blur(10px)",
											border: "1px solid rgba(255, 255, 255, 0.3)"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "position-absolute top-0 start-0 w-100",
												style: {
													height: "4px",
													background: role.color || "#4F46E5",
													opacity: .8
												}
											}),
											!role.status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "position-absolute top-0 end-0 bg-secondary text-white px-3 py-1 small fw-bold",
												style: {
													fontSize: "10px",
													borderBottomLeftRadius: "12px",
													zIndex: 1
												},
												children: "INACTIVE"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex justify-content-between align-items-start mb-4 position-relative z-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "role-icon-container rounded-4 shadow-sm transition-all group-hover-bounce",
														style: {
															background: `linear-gradient(135deg, ${role.color || "#4F46E5"}15, ${role.color || "#4F46E5"}25)`,
															color: role.color || "#4F46E5",
															border: `1px solid ${role.color || "#4F46E5"}30`
														},
														children: import_react.cloneElement(getIcon(role.icon), {
															size: 40,
															strokeWidth: 2.2
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
														className: "mb-0 fw-bold fs-5 text-dark",
														children: role.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex align-items-center gap-2 mt-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "badge rounded-pill px-2 py-1",
															style: {
																backgroundColor: `${role.color || "#4F46E5"}15`,
																color: role.color || "#4F46E5",
																fontSize: "10px",
																fontWeight: "800"
															},
															children: ["LEVEL ", role.level || 1]
														}), role.status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "status-dot pulse",
															style: { backgroundColor: "#10b981" }
														})]
													})] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "position-absolute",
													style: {
														zIndex: 10,
														top: "1px",
														right: "1px"
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn btn-icon btn-white hover-scale",
														style: {
															width: "20px",
															height: "20px",
															padding: "0"
														},
														onClick: (e) => {
															e.stopPropagation();
															setActiveDropdown(activeDropdown === role.id ? null : role.id);
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiMoreVertical, {
															size: 15,
															className: "text-muted"
														})
													}), activeDropdown === role.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "dropdown-menu show dropdown-menu-end border-0 shadow-lg p-2 mt-2 transition-all",
														style: {
															right: "0",
															borderRadius: "12px",
															minWidth: "140px"
														},
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																className: "dropdown-item rounded-3 d-flex align-items-center gap-2 py-2",
																onClick: () => handleViewRole(role.id),
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiEye, {
																	size: 18,
																	className: "text-primary"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "small fw-bold",
																	children: "View Profile"
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																className: "dropdown-item rounded-3 d-flex align-items-center gap-2 py-2",
																onClick: () => handleEditRole(role.id),
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiEdit2, {
																	size: 18,
																	className: "text-primary"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "small fw-bold",
																	children: "Edit Role"
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dropdown-divider opacity-50" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																className: "dropdown-item rounded-3 d-flex align-items-center gap-2 py-2 text-danger",
																onClick: () => handleDeleteRole(role.id),
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiTrash2, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "small fw-bold",
																	children: "Delete Role"
																})]
															})
														]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted mb-4 line-clamp-3 fs-6",
												style: {
													minHeight: "4.5em",
													lineHeight: "1.6"
												},
												children: role.description || "No description provided for this role."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-auto pt-3 border-top d-flex align-items-center justify-content-between position-relative z-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "avatar-group d-flex align-items-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "p-2 rounded-circle bg-light d-flex align-items-center justify-content-center border border-white",
															style: {
																width: "32px",
																height: "32px"
															},
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUsers, {
																size: 14,
																className: "text-muted"
															})
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "fw-bold small text-dark",
														children: [getUserCount(role), " Members"]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													className: "btn btn-sm px-3 rounded-pill fw-bold transition-all group-hover-px",
													style: {
														backgroundColor: `${role.color || "#4F46E5"}15`,
														color: role.color || "#4F46E5",
														border: "none"
													},
													onClick: () => handleEditRole(role.id),
													children: ["Manage ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiKey, { className: "ms-1 small" })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "position-absolute bottom-0 end-0 opacity-0 group-hover-opacity-10 transition-all",
												style: {
													width: "120px",
													height: "120px",
													background: `radial-gradient(circle, ${role.color || "#4F46E5"} 0%, transparent 70%)`,
													transform: "translate(30%, 30%)",
													zIndex: 0
												}
											})
										]
									})
								}, role.id)),
								!roles.some((r) => r.name === "Admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6 col-lg-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "role-card p-4 border-0 rounded-4 bg-light position-relative h-100 shadow-sm overflow-hidden group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "position-absolute top-0 start-0 w-100 h-1",
												style: {
													height: "4px",
													background: "#64748b"
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "d-flex justify-content-between align-items-start mb-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "p-3 bg-white text-secondary rounded-4 shadow-sm group-hover-bounce transition-all",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, { size: 28 })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
														className: "mb-0 fw-bold fs-5",
														children: "Admin"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "badge rounded-pill px-2 py-1 mt-1",
														style: {
															backgroundColor: "#f1f5f9",
															color: "#64748b",
															fontSize: "10px",
															fontWeight: "800"
														},
														children: "SYSTEM ROLE"
													})] })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted mb-4 fs-6",
												style: { lineHeight: "1.6" },
												children: "Full access to all modules and system settings. This role is protected and cannot be modified."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-auto pt-3 border-top d-flex align-items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "p-2 rounded-circle bg-white d-flex align-items-center justify-content-center",
													style: {
														width: "32px",
														height: "32px"
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUsers, {
														size: 14,
														className: "text-muted"
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "fw-bold small",
													children: [userCountByRole["name:Admin"] || 0, " Members"]
												})]
											})
										]
									})
								})
							]
						})
					})]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
        .role-card {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .role-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
          background: rgba(255, 255, 255, 1) !important;
        }
        .group:hover .group-hover-actions {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .group-hover-actions {
          transform: translateY(-10px);
        }
        .group:hover .group-hover-bounce {
          transform: scale(1.1) translateY(-2px);
        }
        .group:hover .group-hover-px {
          padding-left: 1.5rem !important;
          padding-right: 1.5rem !important;
        }
        .hover-scale:hover {
          transform: scale(1.1);
        }
        .btn-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .pulse {
          box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .role-icon-container {
          width: 104px;
          height: 104px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 104px;
          transition: all 0.3s ease;
        }
        .role-icon-container svg {
          width: 56px !important;
          height: 56px !important;
          stroke-width: 2.5;
        }
      ` } })]
	});
};
//#endregion
export { RolesList as default };
