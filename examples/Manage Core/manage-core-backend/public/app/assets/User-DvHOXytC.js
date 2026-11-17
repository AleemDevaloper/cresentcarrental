import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Cn as faClock, Ct as faBuilding, Dl as require_jsx_runtime, I as faArrowRight, Jc as faUserPlus, Ma as faMessage, _c as faTrash, _r as faEnvelope, bl as useApp, bt as faBriefcase, ga as faList, go as faPhone, hr as faEllipsisV, hs as faShieldAlt, ka as faMapMarkerAlt, on as faCircle, oo as faPen, os as faSearch, ru as require_react, sc as faThLarge, tl as faUsers, vl as FontAwesomeIcon, xi as faGlobe } from "./ai-BHgPkVLC.js";
import { N as deleteUser, P as listUsers } from "./superadmin-Cn5Mt1aQ.js";
//#region src/pages/user/User.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var User = () => {
	const { theme, setActiveTab, setEditUser, addNotification, confirmDialog } = useApp();
	const [users, setUsers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function load() {
			try {
				const data = await listUsers();
				if (!cancelled) {
					setUsers(data);
					setLoading(false);
				}
			} catch (err) {
				console.error("Error loading users", err);
				addNotification(err?.message || "Unable to load users. Please try again.", "error", 5e3, { title: "Users Unavailable" });
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, []);
	const handleDelete = async (id) => {
		if (!await confirmDialog({
			title: "Delete User",
			message: "Are you sure you want to delete this user? This action cannot be undone.",
			variant: "danger",
			confirmLabel: "Yes, Delete"
		})) return;
		try {
			await deleteUser(id);
			setUsers(await listUsers());
			addNotification("User deleted successfully", "success", 4e3, { title: "User Deleted" });
		} catch (err) {
			addNotification(err?.message || "Failed to delete user", "error", 5e3, { title: "Delete Failed" });
		}
	};
	const handleEdit = (user) => {
		setEditUser(user);
		setActiveTab("add-user");
	};
	const handleAddUser = () => {
		setEditUser(null);
		setActiveTab("add-user");
	};
	const filteredUsers = users.filter((u) => (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || (u.empId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || (u.city?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || (u.country?.toLowerCase() || "").includes(searchTerm.toLowerCase()));
	const isDark = theme === "dark";
	const cardBg = isDark ? "#1e293b" : "#ffffff";
	const textColor = isDark ? "#f1f5f9" : "#111827";
	const borderColor = isDark ? "#334155" : "#e5e7eb";
	const subBg = isDark ? "#0f172a" : "#f8fafc";
	const UserCard = ({ u }) => {
		const performance = Math.floor(Math.random() * 40) + 60;
		const attendance = Math.floor(Math.random() * 20) + 80;
		const productivity = Math.floor(Math.random() * 30) + 70;
		const taskCount = Math.floor(Math.random() * 15);
		const projCount = Math.floor(Math.random() * 5);
		const experience = (Math.random() * 10).toFixed(1);
		const getWorkloadLabel = (count) => {
			if (count > 12) return {
				label: "Overloaded",
				color: "danger"
			};
			if (count > 8) return {
				label: "High",
				color: "warning"
			};
			if (count > 4) return {
				label: "Medium",
				color: "primary"
			};
			return {
				label: "Low",
				color: "success"
			};
		};
		const workload = getWorkloadLabel(taskCount);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-xl-4 col-lg-6 mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm user-premium-card h-100 transition-all",
				style: {
					background: cardBg,
					borderRadius: "24px"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex justify-content-between align-items-start mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold overflow-hidden border border-2 border-white shadow-sm",
									style: {
										width: "64px",
										height: "64px"
									},
									children: u.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: u.avatar,
										alt: u.name,
										style: {
											width: "100%",
											height: "100%",
											objectFit: "cover"
										}
									}) : (u.name || "?").charAt(0).toUpperCase()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold mb-0",
										style: { color: textColor },
										children: u.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted extra-small",
										children: u.role
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2 mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCircle,
											className: `small ${u.isOnline ? "text-success" : "text-secondary opacity-25"}`,
											style: { fontSize: "0.5rem" }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "extra-small text-muted",
											children: u.isOnline ? "Online" : "Offline"
										})]
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "dropdown",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-icon btn-light rounded-circle shadow-none",
									"data-bs-toggle": "dropdown",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faEllipsisV,
										className: "text-muted small"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 rounded-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2",
											onClick: () => handleEdit(u),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faPen,
												size: "xs"
											}), " Edit Profile"]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faShieldAlt,
												size: "xs"
											}), " Change Role"]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faBriefcase,
												size: "xs"
											}), " Assign Project"]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "dropdown-divider opacity-50" }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2 text-danger",
											onClick: () => handleDelete(u.id),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faTrash,
												size: "xs"
											}), " Delete User"]
										}) })
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-2 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-4",
										style: { background: subBg },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "extra-small text-muted mb-1 text-uppercase fw-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faBuilding,
												className: "me-1"
											}), " Dept"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold text-truncate",
											style: { color: textColor },
											children: u.organization || "Corporate"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-4",
										style: { background: subBg },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "extra-small text-muted mb-1 text-uppercase fw-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faClock,
												className: "me-1"
											}), " Exp"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: [experience, " Years"]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-12",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-4",
										style: { background: subBg },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "extra-small text-muted mb-1 text-uppercase fw-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faMapMarkerAlt,
												className: "me-1"
											}), " Location"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: [u.city || "Not Set", u.country ? `, ${u.country}` : ""]
										})]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap gap-2 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge bg-success-subtle text-success px-3 py-2 rounded-pill small fw-bold",
									children: "Active"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge bg-primary-subtle text-primary px-3 py-2 rounded-pill small fw-bold",
									children: "Full Time"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge bg-info-subtle text-info px-3 py-2 rounded-pill small fw-bold",
									children: "Remote"
								}),
								u.role === "Admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge bg-purple-subtle text-purple px-3 py-2 rounded-pill small fw-bold",
									children: "Team Lead"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "performance-section mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "extra-small fw-bold text-muted text-uppercase",
										children: "Performance Index"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "extra-small fw-bold text-primary",
										children: [performance, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress rounded-pill mb-3",
									style: {
										height: "6px",
										background: isDark ? "#334155" : "#e2e8f0"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress-bar bg-primary rounded-pill",
										style: { width: `${performance}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-3 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "extra-small text-muted mb-1",
											children: "Attendance"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "progress rounded-pill",
											style: {
												height: "4px",
												background: isDark ? "#334155" : "#e2e8f0"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "progress-bar bg-success rounded-pill",
												style: { width: `${attendance}%` }
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "extra-small text-muted mb-1",
											children: "Productivity"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "progress rounded-pill",
											style: {
												height: "4px",
												background: isDark ? "#334155" : "#e2e8f0"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "progress-bar bg-info rounded-pill",
												style: { width: `${productivity}%` }
											})
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-4 mb-4 border border-dashed border-2",
							style: { borderColor },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex justify-content-between align-items-center mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "extra-small text-muted mb-1 fw-bold",
									children: "WORKLOAD"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "small fw-bold",
									style: { color: textColor },
									children: [
										taskCount,
										" Tasks • ",
										projCount,
										" Projects"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `badge bg-${workload.color} px-3 py-1 rounded-pill small`,
									children: workload.label
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex flex-wrap gap-1",
								children: [[
									"React",
									"Node.js",
									"UI/UX"
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge bg-light text-dark extra-small rounded-3 border",
									children: s
								}, s)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "extra-small text-muted ms-1",
									children: "+4 more"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between mt-auto pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-icon btn-light rounded-circle shadow-sm",
										title: "Send Email",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faEnvelope,
											size: "xs"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-icon btn-light rounded-circle shadow-sm",
										title: "Chat Message",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faMessage,
											size: "xs"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-icon btn-light rounded-circle shadow-sm",
										title: "Call User",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faPhone,
											size: "xs"
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary btn-sm px-4 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2",
								onClick: () => handleEdit(u),
								children: ["View Profile ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faArrowRight,
									size: "xs"
								})]
							})]
						})
					]
				})
			})
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-fluid p-4",
		style: { minHeight: "100vh" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "fw-bold mb-1",
					style: { color: textColor },
					children: "User Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted small mb-0",
					children: "System-wide directory of administrators and team members"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "view-mode-toggle p-1 rounded-4 d-flex",
						style: {
							background: subBg,
							border: `1px solid ${borderColor}`
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: `btn btn-sm px-3 rounded-3 border-0 transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-primary fw-bold" : "text-muted"}`,
							onClick: () => setViewMode("grid"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faThLarge,
								className: "me-2"
							}), " Grid"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: `btn btn-sm px-3 rounded-3 border-0 transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary fw-bold" : "text-muted"}`,
							onClick: () => setViewMode("list"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faList,
								className: "me-2"
							}), " List"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary d-flex align-items-center gap-2 px-4 py-2 fw-bold shadow-sm rounded-4",
						onClick: handleAddUser,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faUserPlus }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Provision User" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUsers,
									className: "text-primary me-2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "mb-0 fw-bold",
									style: { color: textColor },
									children: "User Directory"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "badge bg-light text-primary ms-3 px-3 py-2 rounded-pill",
									children: [filteredUsers.length, " Users Found"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "position-relative",
							style: { width: "400px" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faSearch,
								className: "position-absolute text-muted",
								style: {
									top: "50%",
									left: "1.25rem",
									transform: "translateY(-50%)"
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								className: "form-control ps-5 border-0 shadow-sm rounded-4",
								style: {
									height: "3rem",
									background: cardBg,
									color: textColor
								},
								placeholder: "Filter by name, email, employee ID or location...",
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value)
							})]
						})]
					}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "spinner-border text-primary",
							role: "status",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "visually-hidden",
								children: "Loading..."
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted small",
							children: "Synchronizing directory protocols..."
						})]
					}) : filteredUsers.length === 0 && users.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-5 card border-0 shadow-sm rounded-5",
						style: { background: cardBg },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto d-flex align-items-center justify-content-center rounded-circle",
									style: {
										width: "80px",
										height: "80px",
										background: isDark ? "rgba(99,102,241,0.12)" : "rgba(79,70,229,0.08)"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUserPlus,
										style: {
											fontSize: "2rem",
											color: "#6366f1"
										}
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-2",
								style: { color: textColor },
								children: "No Users Yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small text-muted mb-4 mx-auto",
								style: { maxWidth: "360px" },
								children: "Your team directory is empty. Add your first user to get started with user management."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-4 d-inline-flex align-items-center gap-2",
								onClick: handleAddUser,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faUserPlus }), " Add First User"]
							})
						]
					}) : filteredUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-5 card border-0 shadow-sm rounded-5",
						style: { background: cardBg },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto d-flex align-items-center justify-content-center rounded-circle",
									style: {
										width: "80px",
										height: "80px",
										background: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faSearch,
										style: {
											fontSize: "2rem",
											color: "#f59e0b"
										}
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-2",
								style: { color: textColor },
								children: "No Matching Users"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "small text-muted mb-3 mx-auto",
								style: { maxWidth: "360px" },
								children: [
									"No users match \"",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: searchTerm }),
									"\". Try adjusting your search or clear filters to see all ",
									users.length,
									" users."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex justify-content-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-outline-secondary btn-sm px-3 py-2 rounded-pill fw-bold",
									onClick: () => setSearchTerm(""),
									children: "Clear Search"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-primary btn-sm px-3 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2",
									onClick: handleAddUser,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUserPlus,
										size: "xs"
									}), " Add User"]
								})]
							})
						]
					}) : viewMode === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm rounded-5 overflow-hidden",
						style: { background: cardBg },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-hover align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									style: { background: subBg },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "text-muted extra-small text-uppercase",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "border-0 ps-4 py-3",
												children: "Identity Detail"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "border-0 py-3",
												children: "Organizational Matrix"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "border-0 py-3",
												children: "Security Level"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "border-0 py-3",
												children: "Connectivity"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "border-0 pe-4 py-3 text-end",
												children: "Administrative Actions"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredUsers.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									style: { borderColor },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "ps-4 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "avatar me-3 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold overflow-hidden",
													style: {
														width: "40px",
														height: "40px"
													},
													children: u.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: u.avatar,
														alt: u.name,
														style: {
															width: "100%",
															height: "100%",
															objectFit: "cover"
														}
													}) : (u.name || "?").charAt(0).toUpperCase()
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "fw-bold mb-0 small",
													style: { color: textColor },
													children: u.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-muted extra-small",
													children: u.email
												})] })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "fw-semibold extra-small",
												style: { color: textColor },
												children: u.organization || "—"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-muted extra-small d-flex align-items-center gap-1 mt-1",
												children: [u.city && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faMapMarkerAlt,
													className: "me-1"
												}), u.city] }), u.country && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faGlobe,
													className: "me-1 ms-1"
												}), u.country] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "badge bg-soft-primary text-primary rounded-pill fw-bold",
											style: { fontSize: "0.65rem" },
											children: u.role
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "extra-small text-muted mt-1 fw-bold",
											children: u.empId
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faCircle,
													className: `me-2 ${u.isOnline ? "text-success" : "text-secondary opacity-25"}`,
													style: { fontSize: "0.5rem" }
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "extra-small text-muted",
													children: u.isOnline ? "Online" : "Offline"
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pe-4 text-end",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex justify-content-end gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-icon btn-light rounded-circle shadow-none btn-sm",
													onClick: () => handleEdit(u),
													title: "Edit",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faPen,
														className: "text-muted",
														size: "xs"
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-icon btn-light rounded-circle shadow-none btn-sm",
													onClick: () => handleDelete(u.id),
													title: "Delete",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faTrash,
														className: "text-danger",
														size: "xs"
													})
												})]
											})
										})
									]
								}, u.id)) })]
							})
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row",
						children: filteredUsers.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCard, { u }, u.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .extra-small { font-size: 0.7rem; }
        .bg-soft-primary { background: rgba(79, 70, 229, 0.1); }
        .bg-success-subtle { background: rgba(16, 185, 129, 0.1); }
        .bg-info-subtle { background: rgba(6, 182, 212, 0.1); }
        .bg-warning-subtle { background: rgba(245, 158, 11, 0.1); }
        .bg-danger-subtle { background: rgba(239, 68, 68, 0.1); }
        .bg-purple-subtle { background: rgba(139, 92, 246, 0.1); }
        .text-purple { color: #8b5cf6; }
        
        .user-premium-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1) !important; }
        .btn-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
        .transition-all { transition: all 0.3s ease; }
        .border-dashed { border-style: dashed !important; }
        
        .dropdown-item:active { background-color: var(--bs-primary); }
        .nav-link.active { background: white !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
      ` })
		]
	});
};
//#endregion
export { User as default };
