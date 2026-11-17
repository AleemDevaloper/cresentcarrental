const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Login-BIztPByz.js","./ai-BHgPkVLC.js","./rolldown-runtime-Bq5D3eIA.js","./superadmin-Cn5Mt1aQ.js","./dms-CGB1dD8h.js","./fms-BQz62Xux.js","./docx-WpyJpm9V.js","./hrms-DLGg_3y5.js","./pms-CfRqXdhw.js","./AdminDashboard-DS3nw7uF.js","./FrontTabFlyover-BVfJzOXR.js","./HRDashboard-D2XELWx6.js","./ManagerDashboard-Dgrrhn2P.js","./EmployeeDashboard-B9HYY0N7.js","./AddRole-D85PVSah.js","./roles-CNnFlAEt.js","./RoleProfile-C7mKp2b0.js","./SuperAdminDashboard-CgPJtUzM.js","./ModuleManagementCenter-BacEKMbO.js","./PublicInvoiceView-B5q2oqu3.js"])))=>i.map(i=>d[i]);
import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { i as require_client } from "./vendor-DP0tj0ry.js";
import { $l as plugin_legend, $t as faCheckCircle, Bl as DoughnutController, Cl as useAiChat, Dl as require_jsx_runtime, Dt as faBullhorn, Fl as BarController, Fs as faSpinner, Gl as PieController, Hl as LineElement, Il as BarElement, In as faCog, Jl as RadialLinearScale, Kl as PointElement, Ll as BubbleController, Pa as faMicrophone, Pc as faUpRightAndDownLeftFromCenter, Pl as ArcElement, Ql as plugin_decimation, Rl as CategoryScale, Ul as LinearScale, Vl as LineController, Wl as LogarithmicScale, Xl as TimeScale, Yl as ScatterController, Yo as faRotate, Zl as index, b as DialogBox, bl as useApp, eu as plugin_title, gr as faEllipsisVertical, nn as faChevronDown, pa as faLightbulb, ql as PolarAreaController, qo as faRobot, ro as faPaperPlane, ru as require_react, tu as plugin_tooltip, uc as faTimes, v as motion, vl as FontAwesomeIcon, y as AnimatePresence, yl as AppProvider, zl as Chart } from "./ai-BHgPkVLC.js";
import { ei as LoadingOverlay, ti as NotificationBox } from "./fms-BQz62Xux.js";
import { ft as __vitePreload } from "./dms-CGB1dD8h.js";
import { Bt as Navigate, Ft as roleMatchesRoute, Ht as Routes, It as acknowledgeAnnouncement, Lt as listAnnouncements, Mt as ErrorScreen, Nt as getHomeRouteForRole, Pt as normalizeRole, Rt as markAnnouncementRead, Ut as useLocation, Vt as Route, zt as BrowserRouter } from "./superadmin-Cn5Mt1aQ.js";
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/chartSetup.js
var import_client = require_client();
Chart.register(CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, BarElement, ArcElement, PointElement, LineElement, BarController, LineController, DoughnutController, PieController, BubbleController, ScatterController, PolarAreaController, plugin_title, plugin_tooltip, plugin_legend, index, plugin_decimation);
//#endregion
//#region src/pages/CommandCenter/AICopilot.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AICopilot = ({ isDark }) => {
	const { setActiveTab } = useApp();
	const { messages, sendingChatId, createNewChat, sendMessage } = useAiChat();
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [copilotChatId, setCopilotChatId] = (0, import_react.useState)(null);
	const [message, setMessage] = (0, import_react.useState)("");
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const copilotMessages = copilotChatId ? messages[copilotChatId] || [] : [];
	const isSending = copilotChatId !== null && sendingChatId === copilotChatId;
	const ensureChatExists = () => {
		if (!copilotChatId) {
			const id = createNewChat();
			setCopilotChatId(id);
			return id;
		}
		return copilotChatId;
	};
	const handleOpenInWorkspace = () => {
		ensureChatExists();
		setActiveTab("ai_new_chat");
		setIsOpen(false);
	};
	const toggleOpen = () => {
		setIsOpen(!isOpen);
		if (isOpen) setSettingsOpen(false);
	};
	const [sizeEnabled, setSizeEnabled] = (0, import_react.useState)(() => {
		const saved = localStorage.getItem("ai_chat_size_enabled");
		return saved !== null ? JSON.parse(saved) : false;
	});
	const [chatWidth, setChatWidth] = (0, import_react.useState)(() => {
		return parseInt(localStorage.getItem("ai_chat_width") || "350");
	});
	const [chatHeight, setChatHeight] = (0, import_react.useState)(() => {
		return parseInt(localStorage.getItem("ai_chat_height") || "400");
	});
	const chatEndRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleChatbotSizeChange = (event) => {
			const { enabled, width, height } = event?.detail || {};
			if (typeof enabled === "boolean") setSizeEnabled(enabled);
			if (typeof width === "number") setChatWidth(width);
			if (typeof height === "number") setChatHeight(height);
		};
		window.addEventListener("ai-chatbot-size-change", handleChatbotSizeChange);
		return () => window.removeEventListener("ai-chatbot-size-change", handleChatbotSizeChange);
	}, []);
	const saveChatSize = () => {
		localStorage.setItem("ai_chat_size_enabled", JSON.stringify(sizeEnabled));
		localStorage.setItem("ai_chat_width", String(chatWidth));
		localStorage.setItem("ai_chat_height", String(chatHeight));
		setSettingsOpen(false);
	};
	const adjustWidth = (delta) => {
		setChatWidth((prev) => Math.min(800, Math.max(200, prev + delta)));
	};
	const adjustHeight = (delta) => {
		setChatHeight((prev) => Math.min(800, Math.max(300, prev + delta)));
	};
	(0, import_react.useEffect)(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [copilotMessages]);
	const handleSend = async () => {
		if (!message.trim() || isSending) return;
		const id = ensureChatExists();
		const userMsg = message.trim();
		setMessage("");
		await sendMessage(id, userMsg);
	};
	const quickActions = [
		{
			label: "Check Uptime",
			prompt: "Check system uptime and current operational status"
		},
		{
			label: "Approval Risks",
			prompt: "Analyze pending approvals and identify any risks"
		},
		{
			label: "Suggest Fix",
			icon: faLightbulb,
			prompt: "Suggest improvements for current system performance"
		}
	];
	const handleQuickAction = async (prompt) => {
		await sendMessage(ensureChatExists(), prompt);
	};
	const t = (light, dark) => isDark ? dark : light;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ai-copilot-wrapper",
		style: {
			position: "fixed",
			bottom: "30px",
			right: "30px",
			zIndex: 9999
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
			whileHover: { scale: 1.05 },
			whileTap: { scale: .95 },
			onClick: toggleOpen,
			className: "btn p-0 rounded-circle shadow-lg d-flex align-items-center justify-content-center",
			style: {
				width: "44px",
				height: "44px",
				background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
				color: "white",
				border: "none",
				fontSize: "20px"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: isOpen ? faTimes : faRobot })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 20,
				scale: .9
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: {
				opacity: 0,
				y: 20,
				scale: .9
			},
			className: `card shadow-3xl border-0 overflow-hidden ${t("bg-white text-dark", "bg-dark text-white")}`,
			style: {
				position: "absolute",
				bottom: "50px",
				right: "0",
				width: sizeEnabled ? chatWidth + "px" : "350px",
				height: sizeEnabled ? chatHeight + "px" : "400px",
				borderRadius: "24px",
				border: t("1px solid rgba(0,0,0,0.08)", "1px solid rgba(255,255,255,0.1)")
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `p-4 d-flex align-items-center justify-content-between ${t("bg-light", "bg-white bg-opacity-5")}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-primary p-2 rounded-3 text-white shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faRobot })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
							className: `mb-0 fw-black ${t("text-dark", "text-white")}`,
							children: "AI Command Copilot"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
							className: "text-success fw-bold x-small",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pulse-dot d-inline-block bg-success me-1",
								style: {
									width: 6,
									height: 6,
									borderRadius: "50%"
								}
							}), "Neural Engine Active"]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "position-relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: `btn btn-sm rounded-circle ${t("btn-light", "btn-dark")}`,
							onClick: () => setMenuOpen((previous) => !previous),
							title: "Chat options",
							"aria-label": "Chat options",
							"aria-expanded": menuOpen,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEllipsisVertical })
						}), menuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `dropdown-menu show p-2 shadow-lg border-0 ${t("bg-white", "bg-dark text-white")}`,
							style: {
								right: 0,
								top: "calc(100% + 8px)",
								minWidth: 190,
								zIndex: 4
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "dropdown-item rounded-2 d-flex align-items-center gap-2",
									onClick: () => {
										setCopilotChatId(createNewChat());
										setMenuOpen(false);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faRotate }), " Refresh conversation"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "dropdown-item rounded-2 d-flex align-items-center gap-2",
									onClick: () => {
										handleOpenInWorkspace();
										setMenuOpen(false);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faUpRightAndDownLeftFromCenter }), " Open in workspace"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "dropdown-item rounded-2 d-flex align-items-center gap-2",
									onClick: () => {
										setSettingsOpen((previous) => !previous);
										setMenuOpen(false);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCog }), " Chat settings"]
								})
							]
						})]
					})]
				}),
				settingsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `p-3 border-bottom ${t("bg-white", "bg-white bg-opacity-5")}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "x-small fw-bold",
								children: "Custom Size"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "form-check form-switch m-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "form-check-input",
									type: "checkbox",
									checked: sizeEnabled,
									onChange: (e) => setSizeEnabled(e.target.checked),
									style: { cursor: "pointer" }
								})
							})]
						}),
						sizeEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "x-small text-muted",
								children: "Width"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-xs btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center",
										style: {
											width: 22,
											height: 22
										},
										onClick: () => adjustWidth(-10),
										disabled: chatWidth <= 200,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faChevronDown,
											size: "xs"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "x-small fw-bold",
										style: {
											minWidth: 35,
											textAlign: "center"
										},
										children: [chatWidth, "px"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-xs btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center",
										style: {
											width: 22,
											height: 22
										},
										onClick: () => adjustWidth(10),
										disabled: chatWidth >= 800,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faChevronDown,
											size: "xs",
											style: { transform: "rotate(180deg)" }
										})
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center justify-content-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "x-small text-muted",
								children: "Height"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-xs btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center",
										style: {
											width: 22,
											height: 22
										},
										onClick: () => adjustHeight(-10),
										disabled: chatHeight <= 300,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faChevronDown,
											size: "xs"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "x-small fw-bold",
										style: {
											minWidth: 35,
											textAlign: "center"
										},
										children: [chatHeight, "px"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-xs btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center",
										style: {
											width: 22,
											height: 22
										},
										onClick: () => adjustHeight(10),
										disabled: chatHeight >= 800,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faChevronDown,
											size: "xs",
											style: { transform: "rotate(180deg)" }
										})
									})
								]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-primary btn-xs rounded-pill px-3 py-1 fw-bold",
								style: { fontSize: "10px" },
								onClick: saveChatSize,
								children: "Save"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `p-4 d-flex flex-column gap-3 overflow-auto ${t("bg-white", "bg-dark")}`,
					style: { height: "calc(100% - 140px)" },
					children: [copilotMessages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-4 text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faRobot,
							size: "2x",
							className: "mb-2 opacity-25 text-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "x-small",
							children: "How can I assist you today?"
						})]
					}) : copilotMessages.map((msg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `d-flex ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `p-3 rounded-4 shadow-sm`,
							style: {
								maxWidth: "85%",
								fontSize: "13px",
								lineHeight: "1.5",
								backgroundColor: msg.sender === "user" ? "#4f46e5" : t("#f1f5f9", "rgba(255,255,255,0.1)"),
								color: msg.sender === "user" ? "#fff" : t("#1e293b", "#e2e8f0")
							},
							children: msg.text || /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faSpinner,
								spin: true
							})
						})
					}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: chatEndRef })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `p-3 mt-auto border-top ${t("bg-light border-secondary border-opacity-10", "bg-black border-white border-opacity-10")}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "d-flex flex-wrap gap-1 mb-2",
						children: quickActions.map((action, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: `btn btn-xs rounded-pill x-small py-1 px-2 fw-bold ${t("btn-outline-primary", "btn-outline-light")} ${t("", "opacity-75")}`,
							onClick: () => handleQuickAction(action.prompt),
							disabled: isSending,
							children: [action.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: action.icon,
								className: "me-1"
							}), action.label]
						}, i))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `d-flex align-items-center gap-1 rounded-pill p-1 border ${t("bg-light border-dark border-opacity-10", "bg-white bg-opacity-5 border-white border-opacity-10")}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: `btn btn-sm btn-link rounded-circle ${t("text-muted", "text-light")}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faMicrophone })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								className: `form-control border-0 bg-transparent shadow-none x-small ${t("text-dark", "text-white")}`,
								placeholder: t("Ask anything...", "Ask anything..."),
								style: { "--bs-placeholder-color": t("#6c757d", "rgba(255,255,255,0.4)") },
								value: message,
								onChange: (e) => setMessage(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && handleSend(),
								disabled: isSending
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0",
								style: {
									width: "32px",
									height: "32px"
								},
								onClick: handleSend,
								disabled: isSending,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: isSending ? faSpinner : faPaperPlane,
									className: "x-small",
									spin: isSending
								})
							})
						]
					})]
				})
			]
		}) })]
	});
};
//#endregion
//#region src/components/common/AnnouncementSurface.jsx
var dismissedKey = (announcement) => `announcement_dismissed_${announcement.id}_${announcement.updated_at || announcement.published_at || "v1"}`;
function AnnouncementSurface() {
	const { currentUser, addNotification, theme } = useApp();
	const [announcements, setAnnouncements] = (0, import_react.useState)([]);
	const [activePopup, setActivePopup] = (0, import_react.useState)(null);
	const role = normalizeRole(currentUser?.role);
	(0, import_react.useEffect)(() => {
		if (!currentUser || role === "SuperAdmin") return;
		let cancelled = false;
		async function load() {
			try {
				const data = await listAnnouncements({ audience: "recipient" });
				if (cancelled) return;
				const visible = (Array.isArray(data) ? data : []).filter((item) => !localStorage.getItem(dismissedKey(item)));
				setAnnouncements(visible);
				setActivePopup(visible.find((item) => (item.placements || []).includes("Popup Modal")) || null);
			} catch (err) {
				console.error("Announcement load failed:", err);
			}
		}
		load();
		const timer = window.setInterval(load, 6e4);
		return () => {
			cancelled = true;
			window.clearInterval(timer);
		};
	}, [currentUser, role]);
	const topBanner = (0, import_react.useMemo)(() => {
		return announcements.find((item) => {
			const placements = item.placements || [];
			return placements.includes("Top Banner") || placements.includes("Dashboard Banner");
		}) || announcements[0] || null;
	}, [announcements]);
	const closeAnnouncement = async (announcement) => {
		if (announcement.dismissible) {
			localStorage.setItem(dismissedKey(announcement), "1");
			setAnnouncements((prev) => prev.filter((item) => item.id !== announcement.id));
			if (activePopup?.id === announcement.id) setActivePopup(null);
		}
		try {
			await markAnnouncementRead(announcement.id);
		} catch {}
	};
	const acknowledge = async (announcement) => {
		try {
			await acknowledgeAnnouncement(announcement.id);
			localStorage.setItem(dismissedKey(announcement), "1");
			setAnnouncements((prev) => prev.filter((item) => item.id !== announcement.id));
			if (activePopup?.id === announcement.id) setActivePopup(null);
			addNotification?.("Announcement acknowledged", "success");
		} catch (err) {
			addNotification?.(err.message || "Unable to acknowledge announcement", "danger");
		}
	};
	if (!currentUser || role === "SuperAdmin") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		topBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "announcement-global-banner",
			style: { borderLeft: `5px solid ${topBanner.severity_color || "#2563eb"}` },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-start gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "announcement-global-icon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBullhorn })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-grow-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap align-items-center gap-2 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: topBanner.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-primary bg-opacity-10 text-primary text-uppercase",
								children: topBanner.priority
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "small",
							children: topBanner.summary || topBanner.description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex gap-2",
						children: [topBanner.requires_acknowledgement && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm btn-primary rounded-3",
							onClick: () => acknowledge(topBanner),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCheckCircle,
								className: "me-1"
							}), "Acknowledge"]
						}), topBanner.dismissible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-sm btn-light rounded-3",
							onClick: () => closeAnnouncement(topBanner),
							"aria-label": "Dismiss announcement",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTimes })
						})]
					})
				]
			})
		}),
		activePopup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "announcement-popup-backdrop",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `announcement-popup ${theme === "dark" ? "announcement-popup-dark" : ""}`,
				style: { borderTop: `5px solid ${activePopup.severity_color || "#2563eb"}` },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between gap-3 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-primary bg-opacity-10 text-primary text-uppercase mb-2",
								children: activePopup.type?.replaceAll("_", " ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "fw-bold mb-1",
								children: activePopup.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted mb-0",
								children: activePopup.summary
							})
						] }), activePopup.dismissible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-sm btn-light align-self-start",
							onClick: () => closeAnnouncement(activePopup),
							"aria-label": "Close announcement",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTimes })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4",
						style: { whiteSpace: "pre-wrap" },
						children: activePopup.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-outline-secondary rounded-3",
							onClick: () => closeAnnouncement(activePopup),
							children: "Mark Read"
						}), activePopup.requires_acknowledgement && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-primary rounded-3",
							onClick: () => acknowledge(activePopup),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCheckCircle,
								className: "me-1"
							}), "Acknowledge"]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
        .announcement-global-banner {
          position: fixed;
          top: 82px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1060;
          width: min(980px, calc(100vw - 32px));
          background: #ffffff;
          color: #111827;
          border-radius: 8px;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.18);
          padding: 14px 16px;
        }
        .announcement-global-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #2563eb;
          flex-shrink: 0;
        }
        .announcement-popup-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1070;
          background: rgba(15, 23, 42, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .announcement-popup {
          width: min(620px, 100%);
          background: #ffffff;
          color: #111827;
          border-radius: 8px;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35);
          padding: 24px;
        }
        .announcement-popup-dark {
          background: #1e293b;
          color: #f8fafc;
        }
        @media (max-width: 768px) {
          .announcement-global-banner {
            top: 72px;
          }
        }
      ` } })
	] });
}
//#endregion
//#region src/components/common/ErrorBoundary.jsx
var ErrorBoundary = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null
		};
	}
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error) {
		console.warn("ErrorBoundary caught:", error.message);
	}
	render() {
		if (this.state.hasError) return this.props.fallback || /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorScreen, { variant: "500" });
		return this.props.children;
	}
};
//#endregion
//#region src/components/layout/AuthenticatedLayout.jsx
var AuthenticatedLayout = ({ children }) => {
	const { notifications, removeNotification, theme, aiCopilotEnabled, errorDialog, hideErrorDialog, dialogQueue, closeDialog, globalLoading, hideGlobalLoading, addNotification } = (() => {
		try {
			return useApp();
		} catch {
			return {};
		}
	})();
	const isDark = theme === "dark";
	const handleDialogConfirm = (0, import_react.useCallback)((dialog) => {
		if (dialog._resolve) dialog._resolve(true);
		closeDialog(dialog.id);
	}, [closeDialog]);
	const handleDialogCancel = (0, import_react.useCallback)((dialog) => {
		if (dialog._resolve) dialog._resolve(false);
		closeDialog(dialog.id);
	}, [closeDialog]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex flex-column min-vh-100",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBox, {
				notifications,
				onClose: removeNotification
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementSurface, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-grow-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, { children })
			}),
			aiCopilotEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AICopilot, { isDark }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingOverlay, {
				show: globalLoading.show,
				text: globalLoading.text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox, {
				show: errorDialog.show,
				onHide: hideErrorDialog,
				type: "alert",
				variant: "error",
				title: errorDialog.title || "Error",
				message: errorDialog.message,
				details: errorDialog.details,
				confirmLabel: "Close",
				onConfirm: hideErrorDialog,
				size: "small"
			}),
			dialogQueue.map((dialog) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox, {
				show: dialog.show,
				onHide: () => handleDialogCancel(dialog),
				type: dialog.type || "alert",
				variant: dialog.variant || "info",
				title: dialog.title,
				message: dialog.message,
				details: dialog.details,
				confirmLabel: dialog.confirmLabel || (dialog.type === "confirm" ? "Yes, Confirm" : "OK"),
				cancelLabel: dialog.cancelLabel || "Cancel",
				onConfirm: () => handleDialogConfirm(dialog),
				onCancel: () => handleDialogCancel(dialog),
				size: "small"
			}, dialog.id))
		]
	});
};
//#endregion
//#region src/assets/images/logo1.png
var logo1_default = "" + new URL("logo1-Bw1VQqGw.png", import.meta.url).href;
//#endregion
//#region src/components/common/Preloader.jsx
var WORDS = [
	{
		p: "Secure",
		s: "Design"
	},
	{
		p: "Trusted",
		s: "Engineering"
	},
	{
		p: "Scalable",
		s: "Automation"
	},
	{
		p: "Measurable",
		s: "Intelligence"
	},
	{
		p: "Reliable",
		s: "Delivery"
	},
	{
		p: "Ownable",
		s: "Growth"
	}
];
var STAGES = [
	{
		at: 0,
		label: "Booting core"
	},
	{
		at: 20,
		label: "Loading design system"
	},
	{
		at: 40,
		label: "Wiring data layer"
	},
	{
		at: 60,
		label: "Assembling interfaces"
	},
	{
		at: 80,
		label: "Securing your session"
	},
	{
		at: 100,
		label: "Ready"
	}
];
var WORDMARK = Array.from("MANAGE CORE");
function easeOutCubic(t) {
	return 1 - Math.pow(1 - t, 3);
}
function Preloader({ minMs = 1700, fullscreen = true, onDone }) {
	const [state, setState] = (0, import_react.useState)("ready");
	const [pct, setPct] = (0, import_react.useState)(0);
	const [wi, setWi] = (0, import_react.useState)(0);
	const raf = (0, import_react.useRef)(null);
	const start = (0, import_react.useRef)(null);
	const exitTimer = (0, import_react.useRef)(null);
	const stage = STAGES.reduce((acc, s) => pct >= s.at ? s.label : acc, STAGES[0].label);
	(0, import_react.useEffect)(() => {
		const wordTimer = setInterval(() => {
			setWi((prev) => (prev + 1) % WORDS.length);
		}, 1500);
		return () => clearInterval(wordTimer);
	}, []);
	(0, import_react.useEffect)(() => {
		if (state !== "exit" || !onDone) return void 0;
		exitTimer.current = setTimeout(onDone, 760);
		return () => clearTimeout(exitTimer.current);
	}, [state, onDone]);
	(0, import_react.useEffect)(() => {
		start.current = Date.now();
		let last = 0;
		let timer = null;
		const step = () => {
			const el = Date.now() - start.current;
			const eased = easeOutCubic(Math.min(el / 1300, 1));
			const next = Math.round(eased * 100);
			if (next !== last) {
				last = next;
				setPct(next);
				if (next >= 100) {
					const wait = Math.max(minMs - el, 120);
					timer = setTimeout(() => setState("exit"), wait);
					return;
				}
			}
			raf.current = requestAnimationFrame(step);
		};
		raf.current = requestAnimationFrame(step);
		return () => {
			cancelAnimationFrame(raf.current);
			clearTimeout(timer);
		};
	}, [minMs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `mc-pre ${fullscreen ? "mc-pre-full" : "mc-pre-inline"} ${state === "exit" ? "mc-pre-exit" : ""}`,
		role: "status",
		"aria-label": "Loading Manage Core",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mc-pre-veil mc-pre-veil-l",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mc-pre-veil mc-pre-veil-r",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				className: "mc-pre-orb mc-pre-orb-a",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				className: "mc-pre-orb mc-pre-orb-b",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				className: "mc-pre-orb mc-pre-orb-c",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				className: "mc-pre-grid",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mc-pre-inner",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mc-pre-mark",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: logo1_default,
								alt: "Manage Core monogram"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mc-pre-ring",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: "mc-pre-sat mc-pre-sat-1",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: "mc-pre-sat mc-pre-sat-2",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: "mc-pre-sat mc-pre-sat-3",
								"aria-hidden": "true"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mc-pre-word",
						"aria-hidden": "true",
						children: WORDMARK.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: { animationDelay: `${120 + i * 42}ms` },
							children: ch === " " ? "\xA0" : ch
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mc-pre-scribe",
						"aria-live": "polite",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: WORDS[wi].p }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: WORDS[wi].s }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: "mc-pre-caret",
								"aria-hidden": "true"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mc-pre-foot",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mc-pre-pct",
								children: String(pct).padStart(3, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mc-pre-stage",
								"aria-hidden": "true",
								children: stage
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mc-pre-track",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${100 - pct}%` } })
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
//#region src/pages/loading/Loading.jsx
function Loading() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preloader, {});
}
//#endregion
//#region src/routes/ProtectedRoute.jsx
var ProtectedRoute = ({ children, allowedRoles = [] }) => {
	const { currentUser, authLoading } = useApp();
	if (authLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {});
	if (!currentUser) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		replace: true
	});
	if (!roleMatchesRoute(currentUser.role, allowedRoles)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorScreen, {
		variant: "403",
		homePath: getHomeRouteForRole(currentUser.role)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthenticatedLayout, { children });
};
//#endregion
//#region src/routes/AppRoutes.jsx
var Login = (0, import_react.lazy)(() => __vitePreload(() => import("./Login-BIztPByz.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8]), import.meta.url));
var AdminDashboard = (0, import_react.lazy)(() => __vitePreload(() => import("./AdminDashboard-DS3nw7uF.js"), __vite__mapDeps([9,1,2,3,4,5,6,7,8,10]), import.meta.url));
var HRDashboard = (0, import_react.lazy)(() => __vitePreload(() => import("./HRDashboard-D2XELWx6.js"), __vite__mapDeps([11,1,2,3,4,5,6,7,8,10]), import.meta.url));
var ManagerDashboard = (0, import_react.lazy)(() => __vitePreload(() => import("./ManagerDashboard-Dgrrhn2P.js"), __vite__mapDeps([12,1,2,3,4,5,6,7,8,10]), import.meta.url));
var EmployeeDashboard = (0, import_react.lazy)(() => __vitePreload(() => import("./EmployeeDashboard-B9HYY0N7.js"), __vite__mapDeps([13,1,2,3,4,5,6,7,8,10]), import.meta.url));
var AddRole = (0, import_react.lazy)(() => __vitePreload(() => import("./AddRole-D85PVSah.js"), __vite__mapDeps([14,1,2,3,4,5,6,7,8,15]), import.meta.url));
var RoleProfile = (0, import_react.lazy)(() => __vitePreload(() => import("./RoleProfile-C7mKp2b0.js"), __vite__mapDeps([16,1,2,3,4,5,6,7,8,15]), import.meta.url));
var SuperAdminDashboard = (0, import_react.lazy)(() => __vitePreload(() => import("./SuperAdminDashboard-CgPJtUzM.js"), __vite__mapDeps([17,3,1,2,4,5,6,7,8]), import.meta.url));
var ModuleManagementCenter = (0, import_react.lazy)(() => __vitePreload(() => import("./ModuleManagementCenter-BacEKMbO.js"), __vite__mapDeps([18,3,1,2,4,5,6,7,8]), import.meta.url));
var PublicInvoiceView = (0, import_react.lazy)(() => __vitePreload(() => import("./PublicInvoiceView-B5q2oqu3.js"), __vite__mapDeps([19,1,2,3,4,5,6,7,8]), import.meta.url));
var Fallback = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {});
var AppRoutes = () => {
	const { authLoading, currentUser } = useApp();
	const isPublicRoute = useLocation().pathname.startsWith("/public/");
	if (authLoading && !isPublicRoute) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {});
	const homeRoute = currentUser ? getHomeRouteForRole(currentUser.role) : "/login";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fallback, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Routes, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/public/invoice/:token",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicInvoiceView, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/home",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
					to: homeRoute,
					replace: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/login",
				element: currentUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
					to: homeRoute,
					replace: true
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Login, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/superadmin-dashboard",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, {
					allowedRoles: ["SuperAdmin"],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuperAdminDashboard, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/superadmin/modules",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, {
					allowedRoles: ["SuperAdmin"],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleManagementCenter, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/admin-dashboard",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, {
					allowedRoles: ["Admin", "SuperAdmin"],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/hr-dashboard",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, {
					allowedRoles: ["Admin", "HR"],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HRDashboard, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/manager-dashboard",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, {
					allowedRoles: ["Admin", "Manager"],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagerDashboard, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/employee-dashboard",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, {
					allowedRoles: [],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeDashboard, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/admin-dashboard/roles/add",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, {
					allowedRoles: ["Admin", "SuperAdmin"],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddRole, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/admin-dashboard/roles/edit/:id",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, {
					allowedRoles: ["Admin", "SuperAdmin"],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddRole, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "/admin-dashboard/roles/view/:id",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, {
					allowedRoles: ["Admin", "SuperAdmin"],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleProfile, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
				path: "*",
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorScreen, {
					variant: "404",
					homePath: homeRoute
				})
			})
		] })
	});
};
//#endregion
//#region src/App.jsx
function App() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowserRouter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "app-shell app-shell--app",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppRoutes, {})
	}) }) });
}
//#endregion
//#region src/main.jsx
if ("serviceWorker" in navigator) window.addEventListener("load", () => {
	navigator.serviceWorker.register("/sw.js").then((registration) => {
		console.log("SW registered: ", registration);
	}).catch((registrationError) => {
		console.log("SW registration failed: ", registrationError);
	});
});
window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	window.deferredPrompt = e;
	if (window.setDeferredPromptHook) window.setDeferredPromptHook(e);
});
(0, import_client.createRoot)(document.getElementById("root")).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}));
//#endregion
export { logo1_default as t };
