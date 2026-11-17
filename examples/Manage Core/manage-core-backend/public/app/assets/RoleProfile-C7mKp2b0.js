import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, bl as useApp, ru as require_react } from "./ai-BHgPkVLC.js";
import { B as FiArrowLeft, Dt as FiUsers, Gt as useParams, M as Common, O as TopNavBar, P as listUsers, Wt as useNavigate, et as FiEdit2, ot as FiKey, xt as FiShield } from "./superadmin-Cn5Mt1aQ.js";
import { i as listRoles } from "./roles-CNnFlAEt.js";
//#region src/pages/Permissions&Modules/RoleProfile.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var RoleProfile = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { addNotification } = useApp();
	const [isSidebarOpen, setIsSidebarOpen] = (0, import_react.useState)(true);
	const [role, setRole] = (0, import_react.useState)(null);
	const [userCount, setUserCount] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		Promise.all([listRoles(), listUsers()]).then(([roles, users]) => {
			if (cancelled) return;
			const selected = roles.find((item) => String(item.id) === String(id));
			if (!selected) {
				addNotification("Role profile was not found.", "warning");
				navigate("/admin-dashboard");
				return;
			}
			setRole(selected);
			setUserCount(users.filter((user) => String(user.roleId || "") === String(selected.id) || !user.roleId && user.role === selected.name).length);
		}).catch((error) => {
			if (!cancelled) addNotification(error?.message || "Failed to load role profile.", "danger");
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [
		addNotification,
		id,
		navigate
	]);
	const content = loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex flex-column align-items-center justify-content-center h-100 gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "spinner-border text-primary",
			role: "status"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: "Loading role profile..."
		})]
	}) : role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-fluid py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center gap-3 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-light rounded-pill d-flex align-items-center gap-2",
					onClick: () => navigate("/admin-dashboard"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiArrowLeft, {}), " Back to Roles"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary rounded-pill d-flex align-items-center gap-2",
					onClick: () => navigate(`/admin-dashboard/roles/edit/${role.id}`),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiEdit2, {}), " Edit Role"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm rounded-4 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 p-lg-5",
					style: { borderTop: `5px solid ${role.color || "#4F46E5"}` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-4 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "role-profile-icon rounded-4 d-flex align-items-center justify-content-center",
								style: {
									color: role.color || "#4F46E5",
									backgroundColor: `${role.color || "#4F46E5"}18`
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, {
									size: 54,
									strokeWidth: 2
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-uppercase small fw-bold text-muted",
									children: "Role Profile"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mb-1 fw-bold",
									children: role.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "badge rounded-pill",
									style: {
										color: role.color || "#4F46E5",
										backgroundColor: `${role.color || "#4F46E5"}18`
									},
									children: ["Level ", role.level || 1]
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted fs-5 mb-4",
							children: role.description || "No description provided for this role."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-sm-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-3 bg-light",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUsers, { className: "me-2 text-primary" }),
											userCount,
											" Members"
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-sm-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-3 bg-light",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiKey, { className: "me-2 text-primary" }),
											role.permissions?.length || 0,
											" Permissions"
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-sm-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-3 bg-light",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `status-dot me-2 ${role.status ? "bg-success" : "bg-secondary"}` }), role.status ? "Active" : "Inactive"]
									})
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.role-profile-icon { width: 112px; height: 112px; flex: 0 0 112px; }` })
		]
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-fluid vh-100 px-0 overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex h-100",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Common, {
				isSidebarOpen,
				setIsSidebarOpen
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-grow-1 d-flex flex-column min-w-0",
				style: { backgroundColor: "var(--background)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopNavBar, {
					heading: "Role Profile",
					isSidebarOpen,
					onToggleSidebar: () => setIsSidebarOpen((previous) => !previous)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-grow-1 overflow-y-auto",
					children: content
				})]
			})]
		})
	});
};
//#endregion
export { RoleProfile as default };
