import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Dl as require_jsx_runtime, Dt as faBullhorn, It as faCalendarDays, _r as faEnvelope, bl as useApp, ga as faList, gs as faShieldHalved, os as faSearch, ot as faBell, ru as require_react, vl as FontAwesomeIcon, xc as faTriangleExclamation } from "./ai-BHgPkVLC.js";
import { It as acknowledgeAnnouncement, Lt as listAnnouncements, Rt as markAnnouncementRead } from "./superadmin-Cn5Mt1aQ.js";
//#region src/pages/announcements/AnnouncementInbox.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function AnnouncementInbox() {
	const { addNotification, theme } = useApp();
	const [announcements, setAnnouncements] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [filterType, setFilterType] = (0, import_react.useState)("all");
	const isDark = theme === "dark";
	const loadAnnouncements = async () => {
		setLoading(true);
		try {
			const data = await listAnnouncements({ audience: "recipient" });
			setAnnouncements(Array.isArray(data) ? data : []);
		} catch (err) {
			addNotification?.(err.message || "Failed to load announcements", "danger");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadAnnouncements();
	}, []);
	const handleRead = async (id) => {
		try {
			await markAnnouncementRead(id);
			loadAnnouncements();
			addNotification?.("Announcement marked as read", "success");
		} catch (err) {
			addNotification?.(err.message || "Unable to mark as read", "danger");
		}
	};
	const handleAcknowledge = async (id) => {
		try {
			await acknowledgeAnnouncement(id);
			loadAnnouncements();
			addNotification?.("Announcement acknowledged", "success");
		} catch (err) {
			addNotification?.(err.message || "Unable to acknowledge", "danger");
		}
	};
	const filteredAnnouncements = announcements.filter((item) => {
		const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || item.summary?.toLowerCase().includes(searchTerm.toLowerCase()) || item.description?.toLowerCase().includes(searchTerm.toLowerCase());
		if (filterType === "critical") return matchesSearch && item.priority === "critical";
		if (filterType === "read") return matchesSearch && item.read;
		if (filterType === "unread") return matchesSearch && !item.read;
		return matchesSearch;
	});
	const severityColors = {
		critical: {
			bg: "#fee2e2",
			text: "#dc2626",
			icon: "🔴"
		},
		high: {
			bg: "#fef3c7",
			text: "#d97706",
			icon: "🟠"
		},
		medium: {
			bg: "#dbeafe",
			text: "#2563eb",
			icon: "🔵"
		},
		low: {
			bg: "#dcfce7",
			text: "#16a34a",
			icon: "🟢"
		}
	};
	const getPriorityStyling = (priority) => severityColors[priority] || severityColors.medium;
	const stats = {
		total: announcements.length,
		unread: announcements.filter((a) => !a.read).length,
		critical: announcements.filter((a) => a.priority === "critical").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			padding: "24px",
			background: isDark ? "#0f172a" : "#f8fafc",
			minHeight: "100vh"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: isDark ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
					borderRadius: "16px",
					padding: "40px",
					marginBottom: "32px",
					color: "#fff",
					position: "relative",
					overflow: "hidden"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						position: "absolute",
						top: "-40px",
						right: "-40px",
						opacity: .1,
						fontSize: "200px"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBullhorn })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						position: "relative",
						zIndex: 1
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								flexWrap: "wrap",
								gap: "16px",
								marginBottom: "16px"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "12px"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBullhorn,
									style: { fontSize: "24px" }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontSize: "12px",
										fontWeight: "700",
										letterSpacing: "0.1em",
										textTransform: "uppercase",
										opacity: .9
									},
									children: "Company Communications"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									gap: "12px",
									padding: "8px 16px",
									background: "rgba(255,255,255,0.1)",
									borderRadius: "8px",
									backdropFilter: "blur(10px)"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { textAlign: "center" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											style: {
												fontSize: "11px",
												opacity: .8,
												margin: 0
											},
											children: "UNREAD"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											style: {
												fontSize: "18px",
												fontWeight: "700",
												margin: 0
											},
											children: stats.unread
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
										width: "1px",
										background: "rgba(255,255,255,0.2)"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { textAlign: "center" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											style: {
												fontSize: "11px",
												opacity: .8,
												margin: 0
											},
											children: "CRITICAL"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											style: {
												fontSize: "18px",
												fontWeight: "700",
												margin: 0
											},
											children: stats.critical
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							style: {
								fontSize: "36px",
								fontWeight: "900",
								margin: "0 0 8px 0",
								letterSpacing: "-0.02em"
							},
							children: "Announcements"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontSize: "15px",
								opacity: .95,
								margin: 0
							},
							children: "Important company notices, alerts, policy updates, and system messages"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
					gap: "16px",
					marginBottom: "32px"
				},
				children: [
					{
						label: "Total",
						value: stats.total,
						icon: faBullhorn,
						color: "#3b82f6",
						bgColor: "#eff6ff"
					},
					{
						label: "Unread",
						value: stats.unread,
						icon: faBell,
						color: "#f59e0b",
						bgColor: "#fffbeb"
					},
					{
						label: "Critical",
						value: stats.critical,
						icon: faShieldHalved,
						color: "#ef4444",
						bgColor: "#fee2e2"
					},
					{
						label: "Read",
						value: stats.total - stats.unread,
						icon: faCheckCircle,
						color: "#10b981",
						bgColor: "#ecfdf5"
					}
				].map((stat, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						background: isDark ? "#1e293b" : "#fff",
						borderRadius: "12px",
						padding: "20px",
						border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
						boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
						transition: "all 0.3s ease",
						cursor: "pointer",
						position: "relative",
						overflow: "hidden"
					},
					onMouseEnter: (e) => {
						e.currentTarget.style.transform = "translateY(-4px)";
						e.currentTarget.style.boxShadow = isDark ? "0 8px 16px rgba(0,0,0,0.3)" : "0 8px 16px rgba(0,0,0,0.1)";
					},
					onMouseLeave: (e) => {
						e.currentTarget.style.transform = "translateY(0)";
						e.currentTarget.style.boxShadow = isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)";
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						position: "absolute",
						top: "-20px",
						right: "-20px",
						width: "80px",
						height: "80px",
						borderRadius: "50%",
						background: stat.bgColor,
						opacity: isDark ? .1 : .2
					} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "flex-start",
							justifyContent: "space-between",
							position: "relative",
							zIndex: 1
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontSize: "12px",
								color: isDark ? "#94a3b8" : "#64748b",
								margin: "0 0 8px 0",
								fontWeight: "600",
								textTransform: "uppercase",
								letterSpacing: "0.05em"
							},
							children: stat.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							style: {
								fontSize: "32px",
								fontWeight: "900",
								margin: 0,
								color: isDark ? "#f1f5f9" : "#1e293b"
							},
							children: stat.value
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								width: "48px",
								height: "48px",
								borderRadius: "12px",
								background: isDark ? stat.bgColor + "30" : stat.bgColor,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: stat.color,
								fontSize: "20px",
								flexShrink: 0
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: stat.icon })
						})]
					})]
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: isDark ? "#1e293b" : "#fff",
					borderRadius: "12px",
					padding: "20px",
					marginBottom: "24px",
					border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
					display: "flex",
					flexWrap: "wrap",
					gap: "16px",
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							position: "relative",
							flex: 1,
							minWidth: "250px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faSearch,
							style: {
								position: "absolute",
								left: "14px",
								top: "50%",
								transform: "translateY(-50%)",
								color: isDark ? "#64748b" : "#cbd5e1",
								fontSize: "14px",
								pointerEvents: "none"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Search by title, summary, or content...",
							value: searchTerm,
							onChange: (e) => setSearchTerm(e.target.value),
							style: {
								width: "100%",
								padding: "11px 14px 11px 40px",
								borderRadius: "8px",
								border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
								background: isDark ? "#0f172a" : "#f8fafc",
								color: isDark ? "#f1f5f9" : "#1e293b",
								fontSize: "14px",
								outline: "none",
								transition: "all 0.2s",
								fontWeight: "500"
							},
							onFocus: (e) => {
								e.target.style.border = isDark ? "1px solid #475569" : "1px solid #3b82f6";
								e.target.style.boxShadow = isDark ? "0 0 0 3px rgba(71,117,169,0.1)" : "0 0 0 3px rgba(59,130,246,0.1)";
								e.target.style.background = isDark ? "#1e293b" : "#fff";
							},
							onBlur: (e) => {
								e.target.style.border = isDark ? "1px solid #334155" : "1px solid #e2e8f0";
								e.target.style.boxShadow = "none";
								e.target.style.background = isDark ? "#0f172a" : "#f8fafc";
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: "8px",
							flexWrap: "wrap",
							alignItems: "center"
						},
						children: [
							"all",
							"unread",
							"read",
							"critical"
						].map((filter) => {
							const config = {
								all: {
									label: "All",
									bg: "#3b82f6",
									icon: faList
								},
								unread: {
									label: "Unread",
									bg: "#f59e0b",
									icon: faEnvelope
								},
								read: {
									label: "Read",
									bg: "#10b981",
									icon: faCheckCircle
								},
								critical: {
									label: "Critical",
									bg: "#ef4444",
									icon: faTriangleExclamation
								}
							}[filter];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFilterType(filter),
								style: {
									padding: "8px 14px",
									borderRadius: "8px",
									border: filterType === filter ? "none" : `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
									background: filterType === filter ? config.bg : isDark ? "#0f172a" : "#f8fafc",
									color: filterType === filter ? "#fff" : isDark ? "#e2e8f0" : "#64748b",
									fontWeight: "600",
									fontSize: "13px",
									cursor: "pointer",
									transition: "all 0.2s",
									display: "flex",
									alignItems: "center",
									gap: "6px",
									whiteSpace: "nowrap"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: config.icon,
									style: { fontSize: "13px" }
								}), config.label]
							}, filter);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: loadAnnouncements,
						disabled: loading,
						style: {
							padding: "10px 18px",
							borderRadius: "8px",
							border: "none",
							background: "#3b82f6",
							color: "#fff",
							fontWeight: "600",
							fontSize: "13px",
							cursor: loading ? "not-allowed" : "pointer",
							transition: "all 0.2s",
							opacity: loading ? .7 : 1,
							display: "flex",
							alignItems: "center",
							gap: "6px",
							whiteSpace: "nowrap"
						},
						onMouseEnter: (e) => {
							if (!loading) {
								e.target.style.background = "#1d4ed8";
								e.target.style.transform = "scale(1.02)";
							}
						},
						onMouseLeave: (e) => {
							e.target.style.background = "#3b82f6";
							e.target.style.transform = "scale(1)";
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🔄" }), loading ? "Loading..." : "Refresh"]
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					textAlign: "center",
					padding: "60px 20px",
					color: isDark ? "#94a3b8" : "#64748b"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontSize: "48px",
						marginBottom: "16px"
					},
					children: "⏳"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						fontSize: "16px",
						fontWeight: "500"
					},
					children: "Loading announcements..."
				})]
			}) : filteredAnnouncements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: isDark ? "#1e293b" : "#fff",
					borderRadius: "12px",
					padding: "60px 20px",
					textAlign: "center",
					border: isDark ? "1px solid #334155" : "1px solid #e2e8f0"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: "64px",
							marginBottom: "16px",
							opacity: .5
						},
						children: "📭"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
						style: {
							fontSize: "18px",
							fontWeight: "700",
							color: isDark ? "#f1f5f9" : "#1e293b",
							marginBottom: "8px"
						},
						children: searchTerm || filterType !== "all" ? "No announcements found" : "No active announcements"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: isDark ? "#64748b" : "#94a3b8",
							margin: 0
						},
						children: searchTerm || filterType !== "all" ? "Try adjusting your search or filters" : "You are all caught up!"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
					gap: "20px"
				},
				children: filteredAnnouncements.map((item) => {
					const priorityStyle = getPriorityStyling(item.priority || "medium");
					const [isExpanded, setIsExpanded] = import_react.useState(false);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: isDark ? "#1e293b" : "#fff",
							borderRadius: "12px",
							padding: "20px",
							border: `2px solid ${item.read ? isDark ? "#334155" : "#e2e8f0" : priorityStyle.text}`,
							boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
							transition: "all 0.3s ease",
							borderLeft: `5px solid ${priorityStyle.text}`,
							opacity: item.read ? .85 : 1,
							position: "relative",
							cursor: "pointer"
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.boxShadow = isDark ? "0 12px 24px rgba(0,0,0,0.4)" : "0 12px 24px rgba(0,0,0,0.12)";
							e.currentTarget.style.transform = "translateY(-6px)";
							e.currentTarget.style.borderColor = priorityStyle.text;
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.boxShadow = isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)";
							e.currentTarget.style.transform = "translateY(0)";
							e.currentTarget.style.borderColor = item.read ? isDark ? "#334155" : "#e2e8f0" : priorityStyle.text;
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									gap: "12px",
									alignItems: "flex-start",
									marginBottom: "12px"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: "40px",
											height: "40px",
											borderRadius: "10px",
											background: priorityStyle.bg,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: priorityStyle.text,
											fontSize: "18px",
											flexShrink: 0
										},
										children: priorityStyle.icon
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: { flex: 1 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "8px",
												flexWrap: "wrap"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													display: "inline-block",
													background: priorityStyle.bg,
													color: priorityStyle.text,
													padding: "4px 10px",
													borderRadius: "6px",
													fontSize: "10px",
													fontWeight: "700",
													textTransform: "uppercase",
													letterSpacing: "0.05em"
												},
												children: item.priority || "Medium"
											}), item.type && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													fontSize: "10px",
													fontWeight: "700",
													color: isDark ? "#94a3b8" : "#94a3b8",
													textTransform: "uppercase",
													letterSpacing: "0.05em",
													padding: "4px 8px",
													background: isDark ? "#0f172a" : "#f1f5f9",
													borderRadius: "4px"
												},
												children: item.type.replace(/_/g, " ")
											})]
										})
									}),
									item.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											background: "#22c55e",
											color: "#fff",
											width: "28px",
											height: "28px",
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: "14px",
											flexShrink: 0
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckCircle })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								style: {
									fontSize: "18px",
									fontWeight: "700",
									color: isDark ? "#f1f5f9" : "#1e293b",
									margin: "0 0 8px 0",
									lineHeight: "1.4"
								},
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: {
									fontSize: "13px",
									color: isDark ? "#cbd5e1" : "#64748b",
									margin: "0 0 12px 0",
									lineHeight: "1.5"
								},
								children: item.summary
							}),
							item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: {
									fontSize: "13px",
									color: isDark ? "#9ca3af" : "#6b7280",
									margin: "12px 0",
									lineHeight: "1.6",
									whiteSpace: "pre-wrap",
									wordBreak: "break-word",
									maxHeight: isExpanded ? "none" : "60px",
									overflow: isExpanded ? "visible" : "hidden",
									textOverflow: "ellipsis",
									display: "-webkit-box",
									WebkitLineClamp: isExpanded ? "unset" : 2,
									WebkitBoxOrient: "vertical"
								},
								children: item.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									flexWrap: "wrap",
									gap: "12px",
									fontSize: "12px",
									color: isDark ? "#94a3b8" : "#64748b",
									marginTop: "16px",
									paddingTop: "16px",
									borderTop: isDark ? "1px solid #334155" : "1px solid #e2e8f0"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalendarDays }), item.expires_at ? new Date(item.expires_at).toLocaleDateString() : "No expiry"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										marginLeft: "auto",
										fontWeight: "700",
										textTransform: "uppercase"
									},
									children: item.type?.replace(/_/g, " ") || "General"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									gap: "8px",
									marginTop: "16px",
									flexWrap: "wrap"
								},
								children: [
									item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setIsExpanded(!isExpanded),
										style: {
											flex: 1,
											padding: "8px 12px",
											borderRadius: "6px",
											border: `1px solid ${isDark ? "#475569" : "#cbd5e1"}`,
											background: "transparent",
											color: isDark ? "#e2e8f0" : "#64748b",
											fontWeight: "600",
											fontSize: "12px",
											cursor: "pointer",
											transition: "all 0.2s"
										},
										onMouseEnter: (e) => {
											e.target.style.background = isDark ? "rgba(71,117,169,0.1)" : "rgba(59,130,246,0.05)";
											e.target.style.borderColor = isDark ? "#64748b" : "#3b82f6";
										},
										onMouseLeave: (e) => {
											e.target.style.background = "transparent";
											e.target.style.borderColor = isDark ? "#475569" : "#cbd5e1";
										},
										children: isExpanded ? "Show Less" : "Show More"
									}),
									!item.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleRead(item.id),
										style: {
											flex: 1,
											padding: "8px 12px",
											borderRadius: "6px",
											border: `1px solid ${isDark ? "#475569" : "#cbd5e1"}`,
											background: "transparent",
											color: isDark ? "#e2e8f0" : "#64748b",
											fontWeight: "600",
											fontSize: "12px",
											cursor: "pointer",
											transition: "all 0.2s"
										},
										onMouseEnter: (e) => {
											e.target.style.background = isDark ? "#334155" : "#f1f5f9";
										},
										onMouseLeave: (e) => {
											e.target.style.background = "transparent";
										},
										children: "Mark Read"
									}),
									item.requires_acknowledgement && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleAcknowledge(item.id),
										style: {
											flex: 1,
											padding: "8px 12px",
											borderRadius: "6px",
											border: "none",
											background: "#3b82f6",
											color: "#fff",
											fontWeight: "600",
											fontSize: "12px",
											cursor: "pointer",
											transition: "all 0.2s"
										},
										onMouseEnter: (e) => {
											e.target.style.background = "#2563eb";
											e.target.style.boxShadow = "0 4px 12px rgba(59,130,246,0.3)";
										},
										onMouseLeave: (e) => {
											e.target.style.background = "#3b82f6";
											e.target.style.boxShadow = "none";
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCheckCircle,
											style: { marginRight: "6px" }
										}), "Acknowledge"]
									})
								]
							})
						]
					}, item.id);
				})
			})
		]
	});
}
//#endregion
export { AnnouncementInbox as default };
