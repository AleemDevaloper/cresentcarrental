import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Cn as faClock, Dl as require_jsx_runtime, bl as useApp, en as faCheckDouble, gt as faBoxOpen, ii as faFlag, os as faSearch, ot as faBell, ru as require_react, ti as faFilter, uc as faTimes, vc as faTrashAlt, vl as FontAwesomeIcon, xc as faTriangleExclamation } from "./ai-BHgPkVLC.js";
import { A as markAllAsRead, j as markAsRead, k as listNotifications } from "./superadmin-Cn5Mt1aQ.js";
//#region src/pages/comman/Notification.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	{
		key: "all",
		label: "All",
		color: "#6366f1"
	},
	{
		key: "project",
		label: "Projects",
		color: "#4f46e5"
	},
	{
		key: "task",
		label: "Tasks",
		color: "#f59e0b"
	},
	{
		key: "milestone",
		label: "Milestones",
		color: "#10b981"
	}
];
var getNotifIcon = (title = "") => {
	const t = title.toLowerCase();
	if (t.includes("project")) return {
		icon: faBoxOpen,
		color: "#4f46e5",
		bg: "#eef2ff"
	};
	if (t.includes("task")) return {
		icon: faBell,
		color: "#f59e0b",
		bg: "#fff7ed"
	};
	if (t.includes("milestone")) return {
		icon: faFlag,
		color: "#10b981",
		bg: "#ecfdf5"
	};
	return {
		icon: faBell,
		color: "#6366f1",
		bg: "#f5f3ff"
	};
};
var getCategoryKey = (title = "") => {
	const t = title.toLowerCase();
	if (t.includes("project")) return "project";
	if (t.includes("task")) return "task";
	if (t.includes("milestone")) return "milestone";
	return "all";
};
var getTimeAgo = (date) => {
	if (!date) return "";
	const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1e3);
	if (diff < 60) return "just now";
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
	return new Date(date).toLocaleDateString();
};
var formatDate = (date) => {
	if (!date) return "Unknown date";
	return new Date(date).toLocaleString([], {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
};
var getDateGroup = (date) => {
	if (!date) return "Older";
	const now = /* @__PURE__ */ new Date();
	const notifDate = new Date(date);
	const diffDays = Math.floor((now - notifDate) / 864e5);
	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	if (diffDays <= 7) return "This Week";
	return "Older";
};
var GROUP_ORDER = [
	"Today",
	"Yesterday",
	"This Week",
	"Older"
];
function Notification() {
	const { currentUser, addNotification, contentLayout, theme } = useApp();
	const isDark = theme === "dark";
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedIds, setSelectedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [dismissingIds, setDismissingIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const fetchNotifications = async (silent = false) => {
		if (!silent) setLoading(true);
		try {
			const data = await listNotifications(currentUser?.role);
			setNotifications(Array.isArray(data) ? data : []);
		} catch {
			setError("Failed to fetch notifications.");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (currentUser) {
			fetchNotifications();
			const interval = setInterval(() => fetchNotifications(true), 3e4);
			return () => clearInterval(interval);
		}
	}, [currentUser]);
	const filtered = (0, import_react.useMemo)(() => {
		let result = notifications;
		if (activeCategory !== "all") result = result.filter((n) => getCategoryKey(n.title) === activeCategory);
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter((n) => (n.title || "").toLowerCase().includes(q) || (n.message || "").toLowerCase().includes(q));
		}
		return result;
	}, [
		notifications,
		activeCategory,
		searchQuery
	]);
	const grouped = (0, import_react.useMemo)(() => {
		const groups = {};
		filtered.forEach((n) => {
			const g = getDateGroup(n.created_at);
			if (!groups[g]) groups[g] = [];
			groups[g].push(n);
		});
		return groups;
	}, [filtered]);
	const handleMarkAsRead = async (id) => {
		setDismissingIds((prev) => new Set([...prev, id]));
		try {
			await markAsRead(id);
			setTimeout(() => {
				setNotifications((prev) => prev.filter((n) => n.id !== id));
				setDismissingIds((prev) => {
					const next = new Set(prev);
					next.delete(id);
					return next;
				});
				setSelectedIds((prev) => {
					const next = new Set(prev);
					next.delete(id);
					return next;
				});
			}, 300);
			addNotification("Notification dismissed", "success");
		} catch {
			setDismissingIds((prev) => {
				const next = new Set(prev);
				next.delete(id);
				return next;
			});
			addNotification("Failed to mark as read.", "danger");
		}
	};
	const handleBulkMarkAsRead = async () => {
		if (selectedIds.size === 0) return;
		for (const id of selectedIds) await markAsRead(id).catch(() => {});
		setNotifications((prev) => prev.filter((n) => !selectedIds.has(n.id)));
		addNotification(`${selectedIds.size} notification(s) dismissed`, "success");
		setSelectedIds(/* @__PURE__ */ new Set());
	};
	const handleClearAll = async () => {
		if (!window.confirm("Are you sure you want to clear all notifications?")) return;
		try {
			await markAllAsRead();
			setNotifications([]);
			setSelectedIds(/* @__PURE__ */ new Set());
			addNotification("All notifications cleared", "success");
		} catch {
			addNotification("Failed to clear notifications.", "danger");
		}
	};
	const toggleSelect = (id) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};
	const selectAllVisible = () => {
		setSelectedIds(new Set(filtered.map((n) => n.id)));
	};
	const deselectAll = () => setSelectedIds(/* @__PURE__ */ new Set());
	const categoryCounts = (0, import_react.useMemo)(() => {
		const counts = { all: notifications.length };
		CATEGORIES.slice(1).forEach((c) => {
			counts[c.key] = notifications.filter((n) => getCategoryKey(n.title) === c.key).length;
		});
		return counts;
	}, [notifications]);
	if (!currentUser) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-2 px-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "row",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: contentLayout === "compact" ? "col-lg-10 col-xl-8 mx-auto" : "col-12 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "position-relative overflow-hidden rounded-4 p-4 p-lg-5 mb-4",
						style: {
							background: isDark ? "linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.8) 100%)" : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)",
							border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.12)"}`,
							borderRadius: "24px",
							boxShadow: isDark ? "0 10px 30px -10px rgba(0,0,0,0.5)" : "0 10px 30px -10px rgba(99,102,241,0.15)",
							backdropFilter: "blur(20px)"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								height: "4px",
								background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "position-absolute",
								style: {
									right: "-10%",
									top: "-20%",
									width: "300px",
									height: "300px",
									borderRadius: "50%",
									background: isDark ? "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" : "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
									pointerEvents: "none"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "position-absolute",
								style: {
									left: "-5%",
									bottom: "-30%",
									width: "250px",
									height: "250px",
									borderRadius: "50%",
									background: isDark ? "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)" : "radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)",
									pointerEvents: "none"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "row align-items-center position-relative",
								style: { zIndex: 3 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-lg-12 mb-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex flex-wrap align-items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "d-flex align-items-center gap-2 px-3 py-1 rounded-pill",
												style: {
													background: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)",
													color: isDark ? "#cbd5e1" : "#4f46e5",
													border: `1px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.15)"}`,
													fontSize: "11px",
													fontWeight: 700,
													letterSpacing: "0.05em",
													textTransform: "uppercase"
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
													width: 6,
													height: 6,
													borderRadius: "50%",
													background: "#6366f1",
													display: "inline-block"
												} }), "Notifications"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2 px-3 py-1 rounded-pill",
												style: {
													background: isDark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.06)",
													border: `1px solid ${isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.15)"}`
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													style: {
														position: "relative",
														display: "inline-flex",
														height: "8px",
														width: "8px"
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
														position: "absolute",
														inset: 0,
														borderRadius: "50%",
														backgroundColor: "#10b981"
													} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
														position: "absolute",
														inset: 0,
														borderRadius: "50%",
														backgroundColor: "#10b981",
														animation: "notif-pulse 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite"
													} })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontSize: "11px",
														fontWeight: 600,
														color: "#10b981"
													},
													children: notifications.length > 0 ? `${notifications.length} active` : "All clear"
												})]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-lg-7 col-xl-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
											className: "fw-extrabold mb-2",
											style: {
												color: isDark ? "#ffffff" : "#0f172a",
												letterSpacing: "-0.03em",
												fontSize: "2.25rem"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faBell,
												className: "me-2",
												style: { color: "#6366f1" }
											}), "Notification Center"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "fs-6 mb-0",
											style: {
												color: isDark ? "#94a3b8" : "#475569",
												maxWidth: "600px",
												lineHeight: "1.7"
											},
											children: notifications.length > 0 ? `You have ${notifications.length} notification${notifications.length > 1 ? "s" : ""}` : "Stay updated with activities across the platform."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-lg-5 col-xl-4 mt-3 mt-lg-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex flex-wrap gap-2 justify-content-lg-end",
											children: [selectedIds.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "btn btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2 border-0 text-white",
												style: { background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" },
												onClick: handleBulkMarkAsRead,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckDouble }),
													" Dismiss (",
													selectedIds.size,
													")"
												]
											}), notifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: `btn btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2 ${isDark ? "btn-outline-light" : "btn-outline-danger"}`,
												onClick: handleClearAll,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrashAlt }), " Clear All"]
											})]
										})
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex flex-wrap gap-3 mb-4 align-items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "position-relative flex-grow-1",
							style: {
								minWidth: 200,
								maxWidth: 360
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faSearch,
									className: "position-absolute text-muted",
									style: {
										left: 14,
										top: "50%",
										transform: "translateY(-50%)",
										fontSize: 13
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-pill ps-5 border-0 shadow-sm ${isDark ? "bg-dark text-light" : "bg-white"}`,
									placeholder: "Search notifications...",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value)
								}),
								searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "position-absolute btn btn-link text-muted p-0",
									style: {
										right: 12,
										top: "50%",
										transform: "translateY(-50%)"
									},
									onClick: () => setSearchQuery(""),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTimes })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex gap-2 flex-wrap",
							children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `btn btn-sm rounded-pill px-3 fw-semibold shadow-sm transition ${activeCategory === cat.key ? "text-white" : `${isDark ? "text-light bg-dark border-secondary" : "text-secondary bg-white border"}`}`,
								style: activeCategory === cat.key ? {
									backgroundColor: cat.color,
									borderColor: cat.color
								} : {},
								onClick: () => setActiveCategory(cat.key),
								children: [cat.label, categoryCounts[cat.key] > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `badge ms-2 ${activeCategory === cat.key ? "bg-white text-dark" : `${isDark ? "bg-dark text-light" : "bg-light text-secondary"}`}`,
									children: categoryCounts[cat.key]
								})]
							}, cat.key))
						})]
					}),
					loading && notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "spinner-border text-primary mb-3",
							role: "status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Loading your notifications..."
						})]
					}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `text-center py-5 rounded-4 border mt-3 ${isDark ? "bg-dark-card border-secondary" : "bg-body-tertiary"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 text-primary opacity-25",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: searchQuery || activeCategory !== "all" ? faSearch : faCheckCircle,
									size: "4x"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "fw-bold",
								children: searchQuery ? "No results found" : activeCategory !== "all" ? `No ${activeCategory} notifications` : "All Caught Up!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted mb-3",
								children: searchQuery ? "Try a different search term" : activeCategory !== "all" ? `You don't have any ${activeCategory} notifications` : "You don't have any new notifications at the moment."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary rounded-pill px-4",
								onClick: () => fetchNotifications(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBell,
									className: "me-2"
								}), "Check for updates"]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-center mb-3 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "small text-muted d-flex align-items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faFilter,
									className: "me-1"
								}),
								filtered.length,
								" notification",
								filtered.length > 1 ? "s" : "",
								activeCategory !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge bg-light text-secondary ms-1",
									children: activeCategory
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex gap-2",
							children: selectedIds.size > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-link btn-sm text-muted p-0 text-decoration-none",
								onClick: deselectAll,
								children: "Deselect all"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-link btn-sm text-muted p-0 text-decoration-none",
								onClick: selectAllVisible,
								children: "Select all"
							})
						})]
					}), GROUP_ORDER.filter((g) => grouped[g]).map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "text-muted fw-bold mb-0 text-uppercase small letter-spacing-1",
								children: group
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {
								className: "flex-grow-1 m-0",
								style: { opacity: .15 }
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex flex-column gap-2",
							children: grouped[group].map((notif) => {
								const style = getNotifIcon(notif.title);
								const isDismissing = dismissingIds.has(notif.id);
								const isSelected = selectedIds.has(notif.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `card shadow-sm rounded-3 overflow-hidden transition ${isDismissing ? "notif-dismissing" : "notif-card"} ${isDark ? "bg-dark-card border-secondary" : "border-0"}`,
									onClick: () => toggleSelect(notif.id),
									role: "button",
									tabIndex: 0,
									onKeyDown: (e) => {
										if (e.key === "Enter") toggleSelect(notif.id);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `card-body p-3 ${isSelected ? "bg-primary bg-opacity-10" : ""}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex gap-3 align-items-start",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "form-check mb-0 mt-1 flex-shrink-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "checkbox",
														className: "form-check-input cursor-pointer",
														checked: isSelected,
														onChange: () => toggleSelect(notif.id),
														onClick: (e) => e.stopPropagation(),
														style: { cursor: "pointer" }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "notif-page-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm",
													style: {
														width: 44,
														height: 44,
														backgroundColor: style.bg,
														color: style.color,
														fontSize: "1rem"
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: style.icon })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex-grow-1 min-w-0",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex justify-content-between align-items-start gap-2 mb-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
																className: "fw-bold mb-0 text-truncate",
																children: notif.title
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "small text-muted text-nowrap d-flex align-items-center gap-1",
																title: formatDate(notif.created_at),
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																	icon: faClock,
																	style: { fontSize: "0.65rem" }
																}), getTimeAgo(notif.created_at)]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-secondary mb-2 small",
															style: { lineHeight: 1.4 },
															children: notif.message
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex justify-content-between align-items-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "small text-muted d-flex align-items-center gap-2",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "rounded-circle d-inline-block",
																		style: {
																			width: 6,
																			height: 6,
																			backgroundColor: style.color
																		}
																	}),
																	"Sent to ",
																	notif.role || "All Users"
																]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																className: "btn btn-sm rounded-pill fw-semibold transition",
																style: {
																	backgroundColor: "#10b981",
																	color: "#fff",
																	padding: "0.25rem 0.9rem",
																	fontSize: "0.75rem"
																},
																onClick: (e) => {
																	e.stopPropagation();
																	handleMarkAsRead(notif.id);
																},
																onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#059669",
																onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "#10b981",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																	icon: faCheckCircle,
																	className: "me-1"
																}), "Done"]
															})]
														})
													]
												})
											]
										})
									})
								}, notif.id);
							})
						})]
					}, group))] }),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "alert alert-danger rounded-4 mt-4 shadow-sm border-0 d-flex align-items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTriangleExclamation }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fw-medium",
							children: error
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
            @keyframes notif-pulse {
              0% { transform: scale(0.6); opacity: 1; }
              100% { transform: scale(2.8); opacity: 0; }
            }
            .notif-card { transition: all 0.2s ease; }
            .notif-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important; }
            .notif-dismissing { opacity: 0; transform: translateX(30px); transition: all 0.3s ease; }
            ${isDark ? `
              .notif-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important; }
              .form-check-input { background-color: #334155; border-color: #475569; }
              hr { border-color: #334155 !important; }
            ` : ""}
          ` })
				]
			})
		})
	});
}
//#endregion
export { Notification as default };
