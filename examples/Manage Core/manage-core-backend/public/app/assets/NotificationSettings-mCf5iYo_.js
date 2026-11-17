import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Cn as faClock, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, Gn as faCopy, Pi as faHashtag, Qa as faNetworkWired, Sr as faExclamationCircle, Tl as universfield_new_notification_040_493469_default, Yt as faChartLine, _c as faTrash, _r as faEnvelope, bl as useApp, cl as faVolumeUp, d as useTranslation, fc as faToggleOff, fr as faEdit, ot as faBell, pc as faToggleOn, qo as faRobot, rs as faSave, ru as require_react, tl as faUsers, uc as faTimes, v as motion, vl as FontAwesomeIcon, wl as universfield_new_notification_051_494246_default, wo as faPlay, xc as faTriangleExclamation, y as AnimatePresence } from "./ai-BHgPkVLC.js";
//#region src/pages/settings/NotificationSettings.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var NotificationSettings = () => {
	const { theme, themeStyle, addNotification } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const isGlass = themeStyle === "glassmorphism";
	const bg = isDark ? "transparent" : "#f8fafc";
	const cardBg = isDark ? "rgba(30, 41, 59, 0.7)" : "#ffffff";
	const textColor = isDark ? "#f1f5f9" : "#0f172a";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0";
	const inputBg = isDark ? "rgba(255, 255, 255, 0.04)" : "#f1f5f9";
	const primaryGradient = "linear-gradient(135deg, #4f46e5, #7c3aed)";
	const saveGradient = "linear-gradient(135deg, #0184ff, #0056b3)";
	const shadowSm = isDark ? "0 4px 20px rgba(0, 0, 0, 0.35)" : "0 4px 18px rgba(0,0,0,0.04)";
	const radius = 16;
	const [toggles, setToggles] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem("manage_core_audience_toggles");
			if (saved) return JSON.parse(saved);
		} catch (e) {
			console.error(e);
		}
		return {
			employees: true,
			managers: true,
			hr: false,
			finance: false,
			admins: true
		};
	});
	const [emailPrefs, setEmailPrefs] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem("manage_core_email_prefs");
			if (saved) return JSON.parse(saved);
		} catch (e) {
			console.error(e);
		}
		return {
			pmsUpdates: true,
			fmsApprovals: true,
			hrmsRequests: false,
			systemWarnings: true,
			digestFrequency: "Daily Summary"
		};
	});
	const [pushPrefs, setPushPrefs] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem("manage_core_push_prefs");
			if (saved) {
				const parsed = JSON.parse(saved);
				return {
					enablePush: parsed.enablePush ?? true,
					showToasts: parsed.showToasts ?? true,
					playSounds: parsed.playSounds ?? false,
					showPreview: parsed.showPreview ?? true,
					selectedSound: parsed.selectedSound ?? "sound040"
				};
			}
		} catch (e) {
			console.error(e);
		}
		return {
			enablePush: true,
			showToasts: true,
			playSounds: false,
			showPreview: true,
			selectedSound: "sound040"
		};
	});
	const [integrationPrefs, setIntegrationPrefs] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem("manage_core_integration_prefs");
			if (saved) return JSON.parse(saved);
		} catch (e) {
			console.error(e);
		}
		return {
			slackEnabled: true,
			slackWebhook: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
			teamsEnabled: false,
			teamsWebhook: "",
			aiSummaries: true
		};
	});
	const [dndPrefs, setDndPrefs] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem("manage_core_dnd_prefs");
			if (saved) return JSON.parse(saved);
		} catch (e) {
			console.error(e);
		}
		return {
			dndEnabled: true,
			dndStart: "22:00",
			dndEnd: "07:00",
			allowHighPriority: true
		};
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [templateList, setTemplateList] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem("manage_core_templates");
			if (saved) return JSON.parse(saved);
		} catch (e) {
			console.error(e);
		}
		return [
			{
				id: 1,
				name: "Welcome Email",
				type: "Email",
				channel: "HRMS",
				status: "Active",
				updated: "2026-06-10",
				subject: "Welcome to ManageCore, {{employee_name}}!",
				body: "Hi {{employee_name}},\n\nWelcome to our organization! Your profile is provisioned on the HRMS portal. Please sign in to verify details."
			},
			{
				id: 2,
				name: "Leave Approved",
				type: "In-App",
				channel: "HRMS",
				status: "Active",
				updated: "2026-06-08",
				subject: "Leave Request Approved",
				body: "Good news! Your leave application for {{days}} days starting on {{start_date}} has been approved by your supervisor."
			},
			{
				id: 3,
				name: "Payroll Processed",
				type: "Email",
				channel: "Payroll",
				status: "Active",
				updated: "2026-06-05",
				subject: "Payslip for {{month}} Released",
				body: "Dear {{employee_name}},\n\nYour payslip for the month of {{month}} is now available for download under FMS employee center."
			},
			{
				id: 4,
				name: "Expense Rejected",
				type: "SMS",
				channel: "Finance",
				status: "Inactive",
				updated: "2026-06-01",
				subject: "Expense Rejected",
				body: "FMS Alert: Expense claim voucher {{voucher_id}} for {{amount}} has been returned/rejected. Review portal."
			},
			{
				id: 5,
				name: "Attendance Alert",
				type: "Push",
				channel: "HRMS",
				status: "Active",
				updated: "2026-05-28",
				subject: "Biometric Clock Missing",
				body: "Standard shift warning: We missed your morning clock-in. Please submit attendance corrections if duty is out-office."
			},
			{
				id: 6,
				name: "Performance Review",
				type: "Email",
				channel: "HRMS",
				status: "Active",
				updated: "2026-05-20",
				subject: "Performance Appraisal Released",
				body: "Dear {{employee_name}},\n\nYour annual performance review has been signed by the management. Click link to view evaluation feedback."
			}
		];
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [modalMode, setModalMode] = (0, import_react.useState)("add");
	const [activeTemplate, setActiveTemplate] = (0, import_react.useState)(null);
	const [showPreviewModal, setShowPreviewModal] = (0, import_react.useState)(false);
	const [previewTemplate, setPreviewTemplate] = (0, import_react.useState)(null);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formType, setFormType] = (0, import_react.useState)("Email");
	const [formChannel, setFormChannel] = (0, import_react.useState)("HRMS");
	const [formStatus, setFormStatus] = (0, import_react.useState)("Active");
	const [formSubject, setFormSubject] = (0, import_react.useState)("");
	const [formBody, setFormBody] = (0, import_react.useState)("");
	const stats = [
		{
			label: "Unread Notifications",
			value: "1,247",
			icon: faBell,
			color: "#4f46e5",
			progress: 62
		},
		{
			label: "Queued Emails",
			value: "3,842",
			icon: faEnvelope,
			color: "#f59e0b",
			progress: 78
		},
		{
			label: "Failed Notifications",
			value: "23",
			icon: faExclamationCircle,
			color: "#ef4444",
			progress: 23
		},
		{
			label: "Delivery Rate",
			value: "98.7%",
			icon: faChartLine,
			color: "#10b981",
			progress: 99
		}
	];
	const typeColors = {
		Email: {
			bg: isDark ? "rgba(124, 58, 237, 0.2)" : "#ede9fe",
			text: "#7c3aed"
		},
		"In-App": {
			bg: isDark ? "rgba(37, 99, 235, 0.2)" : "#dbeafe",
			text: "#2563eb"
		},
		SMS: {
			bg: isDark ? "rgba(219, 39, 119, 0.2)" : "#fce7f3",
			text: "#db2777"
		},
		Push: {
			bg: isDark ? "rgba(5, 150, 105, 0.2)" : "#d1fae5",
			text: "#059669"
		}
	};
	const statusColors = {
		Active: {
			bg: isDark ? "rgba(22, 163, 74, 0.2)" : "#dcfce7",
			text: "#16a34a"
		},
		Inactive: {
			bg: isDark ? "rgba(148, 163, 184, 0.2)" : "#f1f5f9",
			text: "#94a3b8"
		}
	};
	const audiences = [
		{
			key: "employees",
			label: "Employees"
		},
		{
			key: "managers",
			label: "Managers"
		},
		{
			key: "hr",
			label: "HR"
		},
		{
			key: "finance",
			label: "Finance"
		},
		{
			key: "admins",
			label: "Admins"
		}
	];
	const footerStats = [
		{
			label: "Notification Scheduling",
			value: `${templateList.filter((t) => t.status === "Active").length} active rules`
		},
		{
			label: "Escalation Rules",
			value: "5 configured"
		},
		{
			label: "Multi-language Templates",
			value: "12 languages"
		}
	];
	const playPreviewSound = (soundKey) => {
		const audio = new Audio(soundKey === "sound051" ? universfield_new_notification_051_494246_default : universfield_new_notification_040_493469_default);
		audio.volume = .6;
		audio.play().catch((e) => console.warn("Audio playback deferred by browser interaction rules:", e));
	};
	const handleSave = () => {
		setSaving(true);
		setSuccess(false);
		try {
			localStorage.setItem("manage_core_audience_toggles", JSON.stringify(toggles));
			localStorage.setItem("manage_core_email_prefs", JSON.stringify(emailPrefs));
			localStorage.setItem("manage_core_push_prefs", JSON.stringify(pushPrefs));
			localStorage.setItem("manage_core_integration_prefs", JSON.stringify(integrationPrefs));
			localStorage.setItem("manage_core_dnd_prefs", JSON.stringify(dndPrefs));
			localStorage.setItem("manage_core_templates", JSON.stringify(templateList));
			localStorage.setItem("manage_core_play_sounds", pushPrefs.playSounds ? "true" : "false");
			localStorage.setItem("manage_core_selected_sound", pushPrefs.selectedSound || "sound040");
		} catch (e) {
			console.error("Failed to save settings:", e);
		}
		setTimeout(() => {
			setSaving(false);
			setSuccess(true);
			if (addNotification) addNotification("Notification configurations synchronized successfully!", "success");
			setTimeout(() => setSuccess(false), 4e3);
		}, 1200);
	};
	const openAddModal = () => {
		setModalMode("add");
		setFormName("");
		setFormType("Email");
		setFormChannel("HRMS");
		setFormStatus("Active");
		setFormSubject("");
		setFormBody("");
		setShowModal(true);
	};
	const openEditModal = (t) => {
		setModalMode("edit");
		setActiveTemplate(t);
		setFormName(t.name);
		setFormType(t.type);
		setFormChannel(t.channel);
		setFormStatus(t.status);
		setFormSubject(t.subject || "");
		setFormBody(t.body || "");
		setShowModal(true);
	};
	const saveTemplateForm = (e) => {
		e.preventDefault();
		if (!formName.trim() || !formBody.trim()) {
			alert("Template Name and Body content are required.");
			return;
		}
		const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		if (modalMode === "add") {
			setTemplateList([{
				id: Date.now(),
				name: formName,
				type: formType,
				channel: formChannel,
				status: formStatus,
				updated: todayStr,
				subject: formSubject,
				body: formBody
			}, ...templateList]);
			if (addNotification) addNotification(`Template "${formName}" created successfully!`, "success");
		} else {
			setTemplateList(templateList.map((item) => {
				if (item.id === activeTemplate.id) return {
					...item,
					name: formName,
					type: formType,
					channel: formChannel,
					status: formStatus,
					updated: todayStr,
					subject: formSubject,
					body: formBody
				};
				return item;
			}));
			if (addNotification) addNotification(`Template "${formName}" updated successfully!`, "success");
		}
		setShowModal(false);
	};
	const duplicateTemplate = (t) => {
		const newT = {
			...t,
			id: Date.now(),
			name: `${t.name} (Copy)`,
			updated: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
		};
		setTemplateList([newT, ...templateList]);
		if (addNotification) addNotification(`Duplicated template into "${newT.name}"!`, "success");
	};
	const deleteTemplate = (id) => {
		if (!window.confirm("Are you sure you want to permanently delete this notification template?")) return;
		const target = templateList.find((t) => t.id === id);
		setTemplateList(templateList.filter((t) => t.id !== id));
		if (addNotification && target) addNotification(`Template "${target.name}" purged.`, "warning");
	};
	const openPreview = (t) => {
		setPreviewTemplate(t);
		setShowPreviewModal(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `w-100 ${isGlass ? "glass-dashboard-content" : ""}`,
		style: {
			padding: "24px 30px",
			background: bg,
			minHeight: "100%",
			color: textColor
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: cardBg,
					borderRadius: radius,
					border: `1px solid ${borderColor}`,
					padding: "20px 24px",
					marginBottom: 24,
					boxShadow: shadowSm,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: 16
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 16
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							width: 48,
							height: 48,
							borderRadius: 12,
							background: primaryGradient,
							color: "#fff",
							fontSize: 20,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 6px 14px rgba(79,70,229,0.25)",
							flexShrink: 0
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBell })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 20,
							fontWeight: 700,
							letterSpacing: "-0.01em",
							color: textColor,
							lineHeight: 1.3
						},
						children: "Enterprise Notification Center"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 12,
							color: mutedColor,
							fontWeight: 500,
							marginTop: 1
						},
						children: "Manage email, in-app, SMS, push notifications and workflow alerts"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						gap: 12,
						alignItems: "center"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: openAddModal,
						style: {
							padding: "10px 20px",
							borderRadius: 10,
							border: "none",
							background: primaryGradient,
							color: "#fff",
							fontWeight: 600,
							fontSize: 12,
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: 8,
							letterSpacing: "0.02em",
							boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
							transition: "all 0.2s"
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.transform = "translateY(-1px)";
							e.currentTarget.style.boxShadow = "0 6px 20px rgba(79,70,229,0.35)";
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.transform = "translateY(0)";
							e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,70,229,0.3)";
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), " ADD TEMPLATE"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSave,
						disabled: saving,
						style: {
							padding: "10px 20px",
							borderRadius: 10,
							border: "none",
							background: saveGradient,
							color: "#fff",
							fontWeight: 600,
							fontSize: 12,
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: 8,
							letterSpacing: "0.02em",
							boxShadow: "0 4px 12px rgba(1,132,255,0.3)",
							transition: "all 0.2s",
							opacity: saving ? .7 : 1
						},
						onMouseEnter: (e) => {
							if (!saving) {
								e.currentTarget.style.transform = "translateY(-1px)";
								e.currentTarget.style.boxShadow = "0 6px 20px rgba(1,132,255,0.35)";
							}
						},
						onMouseLeave: (e) => {
							if (!saving) {
								e.currentTarget.style.transform = "translateY(0)";
								e.currentTarget.style.boxShadow = "0 4px 12px rgba(1,132,255,0.3)";
							}
						},
						children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "spinner-border spinner-border-sm me-1",
							role: "status",
							"aria-hidden": "true",
							style: {
								width: "12px",
								height: "12px"
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSave }), saving ? "SAVING..." : "SAVE SETTINGS"]
					})]
				})]
			}),
			success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "alert alert-success border-0 shadow-sm rounded-4 d-flex align-items-center gap-2 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckCircle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Notification configurations updated successfully and propagated to server queues." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4",
				style: { marginBottom: 24 },
				children: stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-3 col-sm-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: cardBg,
							borderRadius: radius,
							border: `1px solid ${borderColor}`,
							padding: 20,
							boxShadow: shadowSm,
							height: "100%"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 14
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									width: 42,
									height: 42,
									borderRadius: 11,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 16,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									flexShrink: 0
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: { flex: 1 },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 11,
										fontWeight: 600,
										color: mutedColor,
										letterSpacing: "0.04em",
										marginBottom: 2
									},
									children: s.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 24,
										fontWeight: 700,
										color: textColor,
										lineHeight: 1.1
									},
									children: s.value
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								marginTop: 12,
								height: 3,
								borderRadius: 2,
								background: borderColor,
								overflow: "hidden"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
								height: "100%",
								width: `${s.progress}%`,
								borderRadius: 2,
								background: s.color,
								opacity: .6
							} })
						})]
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: cardBg,
					borderRadius: radius,
					border: `1px solid ${borderColor}`,
					padding: 24,
					boxShadow: shadowSm,
					marginBottom: 24
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 16,
							fontWeight: 700,
							marginBottom: 20,
							color: textColor
						},
						children: "Notification Templates"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1.2fr 1.5fr",
							gap: 12,
							padding: "10px 14px",
							fontSize: 11,
							fontWeight: 600,
							color: mutedColor,
							letterSpacing: "0.04em",
							borderBottom: `1px solid ${borderColor}`,
							background: inputBg,
							borderRadius: "8px 8px 0 0"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Template Name" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Type" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Channel" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last Updated" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { textAlign: "center" },
								children: "Actions"
							})
						]
					}),
					templateList.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1.2fr 1.5fr",
							gap: 12,
							padding: "12px 14px",
							fontSize: 13,
							borderBottom: i < templateList.length - 1 ? `1px solid ${borderColor}` : "none",
							alignItems: "center",
							color: textColor,
							transition: "background 0.15s"
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.background = inputBg;
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.background = "transparent";
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { fontWeight: 600 },
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									padding: "2px 8px",
									borderRadius: 6,
									fontSize: 11,
									fontWeight: 600,
									background: typeColors[t.type]?.bg || inputBg,
									color: typeColors[t.type]?.text || mutedColor
								},
								children: t.type
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { color: mutedColor },
								children: t.channel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									padding: "3px 10px",
									borderRadius: 20,
									fontSize: 10,
									fontWeight: 700,
									background: statusColors[t.status]?.bg || "#f1f5f9",
									color: statusColors[t.status]?.text || mutedColor,
									letterSpacing: "0.04em",
									cursor: "pointer"
								},
								onClick: () => {
									const newStatus = t.status === "Active" ? "Inactive" : "Active";
									setTemplateList(templateList.map((item) => item.id === t.id ? {
										...item,
										status: newStatus
									} : item));
								},
								children: t.status.toUpperCase()
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									color: mutedColor,
									fontSize: 12
								},
								children: t.updated
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									justifyContent: "center",
									gap: 6
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => openEditModal(t),
										title: "Edit Template",
										style: {
											width: 30,
											height: 30,
											borderRadius: 8,
											border: `1px solid ${borderColor}`,
											background: "transparent",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifycontent: "center",
											color: mutedColor,
											fontSize: 11,
											transition: "all 0.15s"
										},
										onMouseEnter: (e) => {
											e.currentTarget.style.background = inputBg;
											e.currentTarget.style.color = "#3b82f6";
										},
										onMouseLeave: (e) => {
											e.currentTarget.style.background = "transparent";
											e.currentTarget.style.color = mutedColor;
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faEdit,
											className: "mx-auto"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => duplicateTemplate(t),
										title: "Duplicate Template",
										style: {
											width: 30,
											height: 30,
											borderRadius: 8,
											border: `1px solid ${borderColor}`,
											background: "transparent",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifycontent: "center",
											color: mutedColor,
											fontSize: 11,
											transition: "all 0.15s"
										},
										onMouseEnter: (e) => {
											e.currentTarget.style.background = inputBg;
											e.currentTarget.style.color = "#10b981";
										},
										onMouseLeave: (e) => {
											e.currentTarget.style.background = "transparent";
											e.currentTarget.style.color = mutedColor;
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCopy,
											className: "mx-auto"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => openPreview(t),
										title: "View Template Mockup",
										style: {
											width: 30,
											height: 30,
											borderRadius: 8,
											border: `1px solid ${borderColor}`,
											background: "transparent",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifycontent: "center",
											color: mutedColor,
											fontSize: 11,
											transition: "all 0.15s"
										},
										onMouseEnter: (e) => {
											e.currentTarget.style.background = inputBg;
											e.currentTarget.style.color = "#8b5cf6";
										},
										onMouseLeave: (e) => {
											e.currentTarget.style.background = "transparent";
											e.currentTarget.style.color = mutedColor;
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faEye,
											className: "mx-auto"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => deleteTemplate(t.id),
										title: "Delete Template",
										style: {
											width: 30,
											height: 30,
											borderRadius: 8,
											border: `1px solid ${borderColor}`,
											background: "transparent",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifycontent: "center",
											color: mutedColor,
											fontSize: 11,
											transition: "all 0.15s"
										},
										onMouseEnter: (e) => {
											e.currentTarget.style.background = inputBg;
											e.currentTarget.style.color = "#ef4444";
										},
										onMouseLeave: (e) => {
											e.currentTarget.style.background = "transparent";
											e.currentTarget.style.color = mutedColor;
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faTrash,
											className: "mx-auto"
										})
									})
								]
							})
						]
					}, t.id || i))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: cardBg,
					borderRadius: radius,
					border: `1px solid ${borderColor}`,
					padding: 24,
					boxShadow: shadowSm,
					marginBottom: 24,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: 16
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontSize: 15,
						fontWeight: 700,
						color: textColor
					},
					children: "Audience Controls"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						gap: 10,
						flexWrap: "wrap"
					},
					children: audiences.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setToggles((prev) => ({
							...prev,
							[a.key]: !prev[a.key]
						})),
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8,
							padding: "8px 14px",
							borderRadius: 20,
							border: `1px solid ${borderColor}`,
							background: toggles[a.key] ? primaryGradient : "transparent",
							color: toggles[a.key] ? "#fff" : mutedColor,
							cursor: "pointer",
							fontSize: 12,
							fontWeight: 600,
							transition: "all 0.2s",
							letterSpacing: "0.02em",
							boxShadow: toggles[a.key] ? "0 2px 8px rgba(79,70,229,0.25)" : "none"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: toggles[a.key] ? faToggleOn : faToggleOff,
							style: { fontSize: 13 }
						}), a.label]
					}, a.key))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				style: { marginBottom: 24 },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: cardBg,
							borderRadius: radius,
							border: `1px solid ${borderColor}`,
							padding: 24,
							boxShadow: shadowSm,
							height: "100%"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2.5 border-bottom pb-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center",
								style: {
									width: 38,
									height: 38
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEnvelope })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold text-dark mb-0",
								style: { color: textColor },
								children: "Email Preferences"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-dark-emphasis d-block small",
										style: { color: textColor },
										children: "Project (PMS) Milestones"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: "Receive alerts on sprint deadlines, task completions, and status changes."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											checked: emailPrefs.pmsUpdates,
											onChange: (e) => setEmailPrefs({
												...emailPrefs,
												pmsUpdates: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-dark-emphasis d-block small",
										style: { color: textColor },
										children: "Financial (FMS) Vouchers & Budgets"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: "High priority emails for pending invoice approvals and budget alerts."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											checked: emailPrefs.fmsApprovals,
											onChange: (e) => setEmailPrefs({
												...emailPrefs,
												fmsApprovals: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-dark-emphasis d-block small",
										style: { color: textColor },
										children: "Attendance & HRMS Workflows"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: "Alerts on biometric correction request approvals and leaves."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											checked: emailPrefs.hrmsRequests,
											onChange: (e) => setEmailPrefs({
												...emailPrefs,
												hrmsRequests: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-dark-emphasis d-block small",
										style: { color: textColor },
										children: "System Security & Logs warnings"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: "Receive emergency notices on database usage caps and backup statuses."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											checked: emailPrefs.systemWarnings,
											onChange: (e) => setEmailPrefs({
												...emailPrefs,
												systemWarnings: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-3 border-top mt-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label small fw-bold text-muted uppercase",
											children: "Email Digest Frequency"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "form-select bg-light border-0 rounded-3 text-dark-emphasis",
											style: {
												background: inputBg,
												color: textColor
											},
											value: emailPrefs.digestFrequency,
											onChange: (e) => setEmailPrefs({
												...emailPrefs,
												digestFrequency: e.target.value
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Immediate / Real-time" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Daily Summary" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Weekly Digest" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "None (Disable digests)" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											className: "text-muted d-block mt-1",
											children: "Aggregates non-urgent notifications to reduce inbox noise."
										})
									]
								})
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: cardBg,
							borderRadius: radius,
							border: `1px solid ${borderColor}`,
							padding: 24,
							boxShadow: shadowSm,
							height: "100%"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2.5 border-bottom pb-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center",
								style: {
									width: 38,
									height: 38
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBell })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold text-dark mb-0",
								style: { color: textColor },
								children: "Push & In-App Alerts"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-dark-emphasis d-block small",
										style: { color: textColor },
										children: "Enable Desktop Push Notifications"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: "Displays real-time notifications in browser toast notifications."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											checked: pushPrefs.enablePush,
											onChange: (e) => setPushPrefs({
												...pushPrefs,
												enablePush: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-dark-emphasis d-block small",
										style: { color: textColor },
										children: "Show Toast Popups In-App"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: "Displays sliding banners at the top-right corner of the web page."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											checked: pushPrefs.showToasts,
											onChange: (e) => setPushPrefs({
												...pushPrefs,
												showToasts: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-dark-emphasis d-block small",
										style: { color: textColor },
										children: "Play Audio Alert Sound"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: "Triggers a subtle ping sound when a notification arrives."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											checked: pushPrefs.playSounds,
											onChange: (e) => setPushPrefs({
												...pushPrefs,
												playSounds: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 p-3 rounded-3",
									style: {
										background: inputBg,
										border: `1px solid ${borderColor}`
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "fw-bold text-dark-emphasis d-block small mb-2",
										style: {
											color: textColor,
											fontSize: "11px",
											letterSpacing: "0.04em"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faVolumeUp,
											className: "me-1 text-primary"
										}), " SELECT NOTIFICATION SOUND"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex flex-column gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center justify-content-between p-2.5 rounded-3 border",
											style: {
												cursor: "pointer",
												transition: "all 0.2s",
												background: pushPrefs.selectedSound === "sound040" ? isDark ? "rgba(79, 70, 229, 0.15)" : "#e0e7ff" : "transparent",
												borderColor: pushPrefs.selectedSound === "sound040" ? "#4f46e5" : borderColor,
												opacity: pushPrefs.playSounds ? 1 : .6
											},
											onClick: () => {
												if (!pushPrefs.playSounds) return;
												setPushPrefs((prev) => {
													const newPrefs = {
														...prev,
														selectedSound: "sound040"
													};
													playPreviewSound("sound040");
													return newPrefs;
												});
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "form-check mb-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														className: "form-check-input",
														type: "radio",
														name: "notification_sound_selection",
														disabled: !pushPrefs.playSounds,
														checked: pushPrefs.selectedSound === "sound040",
														onChange: () => {
															setPushPrefs((prev) => {
																const newPrefs = {
																	...prev,
																	selectedSound: "sound040"
																};
																playPreviewSound("sound040");
																return newPrefs;
															});
														},
														style: { cursor: pushPrefs.playSounds ? "pointer" : "not-allowed" }
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "fw-bold small d-block",
													style: { color: textColor },
													children: "Sound 1: Chime Accent"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
													className: "text-muted",
													style: { fontSize: "11px" },
													children: "universfield-new-notification-040.mp3"
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: (e) => {
													e.stopPropagation();
													playPreviewSound("sound040");
												},
												className: "btn btn-sm d-flex align-items-center justify-content-center rounded-pill px-2.5 py-1",
												style: {
													border: "none",
													background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
													color: textColor,
													fontSize: "11px",
													fontWeight: "600"
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faPlay,
													className: "me-1.5",
													style: { fontSize: "9px" }
												}), " Test"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center justify-content-between p-2.5 rounded-3 border",
											style: {
												cursor: "pointer",
												transition: "all 0.2s",
												background: pushPrefs.selectedSound === "sound051" ? isDark ? "rgba(79, 70, 229, 0.15)" : "#e0e7ff" : "transparent",
												borderColor: pushPrefs.selectedSound === "sound051" ? "#4f46e5" : borderColor,
												opacity: pushPrefs.playSounds ? 1 : .6
											},
											onClick: () => {
												if (!pushPrefs.playSounds) return;
												setPushPrefs((prev) => {
													const newPrefs = {
														...prev,
														selectedSound: "sound051"
													};
													playPreviewSound("sound051");
													return newPrefs;
												});
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "form-check mb-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														className: "form-check-input",
														type: "radio",
														name: "notification_sound_selection",
														disabled: !pushPrefs.playSounds,
														checked: pushPrefs.selectedSound === "sound051",
														onChange: () => {
															setPushPrefs((prev) => {
																const newPrefs = {
																	...prev,
																	selectedSound: "sound051"
																};
																playPreviewSound("sound051");
																return newPrefs;
															});
														},
														style: { cursor: pushPrefs.playSounds ? "pointer" : "not-allowed" }
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "fw-bold small d-block",
													style: { color: textColor },
													children: "Sound 2: Minimal Bubble"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
													className: "text-muted",
													style: { fontSize: "11px" },
													children: "universfield-new-notification-051.mp3"
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: (e) => {
													e.stopPropagation();
													playPreviewSound("sound051");
												},
												className: "btn btn-sm d-flex align-items-center justify-content-center rounded-pill px-2.5 py-1",
												style: {
													border: "none",
													background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
													color: textColor,
													fontSize: "11px",
													fontWeight: "600"
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faPlay,
													className: "me-1.5",
													style: { fontSize: "9px" }
												}), " Test"]
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-dark-emphasis d-block small",
										style: { color: textColor },
										children: "Preview Notification Content"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: "Includes details like sender name and text snippet in popups."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											checked: pushPrefs.showPreview,
											onChange: (e) => setPushPrefs({
												...pushPrefs,
												showPreview: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								})
							]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				style: { marginBottom: 24 },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: cardBg,
							borderRadius: radius,
							border: `1px solid ${borderColor}`,
							padding: 24,
							boxShadow: shadowSm,
							height: "100%"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2.5 border-bottom pb-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-circle bg-info bg-opacity-10 text-info d-flex align-items-center justify-content-center",
								style: {
									width: 38,
									height: 38
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faNetworkWired })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold text-dark mb-0",
								style: { color: textColor },
								children: "Collaboration Webhooks"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "fw-bold text-dark-emphasis small",
										style: { color: textColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faHashtag,
											className: "me-2 text-warning"
										}), "Slack Channel Integration"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											checked: integrationPrefs.slackEnabled,
											onChange: (e) => setIntegrationPrefs({
												...integrationPrefs,
												slackEnabled: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									disabled: !integrationPrefs.slackEnabled,
									className: "form-control bg-light border-0 text-dark-emphasis small",
									style: {
										background: inputBg,
										color: textColor
									},
									placeholder: "Slack Incoming Webhook URL",
									value: integrationPrefs.slackWebhook,
									onChange: (e) => setIntegrationPrefs({
										...integrationPrefs,
										slackWebhook: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between align-items-center mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "fw-bold text-dark-emphasis small",
											style: { color: textColor },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faUsers,
												className: "me-2 text-primary"
											}), "Microsoft Teams Webhook"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "form-check form-switch",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-check-input",
												type: "checkbox",
												checked: integrationPrefs.teamsEnabled,
												onChange: (e) => setIntegrationPrefs({
													...integrationPrefs,
													teamsEnabled: e.target.checked
												}),
												style: { cursor: "pointer" }
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										disabled: !integrationPrefs.teamsEnabled,
										className: "form-control bg-light border-0 text-dark-emphasis small",
										style: {
											background: inputBg,
											color: textColor
										},
										placeholder: "Microsoft Teams Connector Webhook URL",
										value: integrationPrefs.teamsWebhook,
										onChange: (e) => setIntegrationPrefs({
											...integrationPrefs,
											teamsWebhook: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center pt-3 border-top mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "fw-bold text-dark-emphasis d-block small",
										style: { color: textColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faRobot,
											className: "me-2 text-primary"
										}), "AI-Generated Summaries"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: "Use local LLMs to generate high-level meeting summary digests to Slack/Teams."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											checked: integrationPrefs.aiSummaries,
											onChange: (e) => setIntegrationPrefs({
												...integrationPrefs,
												aiSummaries: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								})
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: cardBg,
							borderRadius: radius,
							border: `1px solid ${borderColor}`,
							padding: 24,
							boxShadow: shadowSm,
							height: "100%"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2.5 border-bottom pb-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center",
								style: {
									width: 38,
									height: 38
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faClock })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold text-dark mb-0",
								style: { color: textColor },
								children: "Do Not Disturb (DND)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-dark-emphasis d-block small",
										style: { color: textColor },
										children: "Enable Off-Hours Quiet Schedule"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: "Silences push alerts during non-office evening periods."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											checked: dndPrefs.dndEnabled,
											onChange: (e) => setDndPrefs({
												...dndPrefs,
												dndEnabled: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label small fw-bold text-muted uppercase",
											children: "Quiet Period Starts"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "time",
											disabled: !dndPrefs.dndEnabled,
											className: "form-control bg-light border-0 text-dark-emphasis",
											style: {
												background: inputBg,
												color: textColor
											},
											value: dndPrefs.dndStart,
											onChange: (e) => setDndPrefs({
												...dndPrefs,
												dndStart: e.target.value
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label small fw-bold text-muted uppercase",
											children: "Quiet Period Ends"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "time",
											disabled: !dndPrefs.dndEnabled,
											className: "form-control bg-light border-0 text-dark-emphasis",
											style: {
												background: inputBg,
												color: textColor
											},
											value: dndPrefs.dndEnd,
											onChange: (e) => setDndPrefs({
												...dndPrefs,
												dndEnd: e.target.value
											})
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center pt-3 border-top mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "fw-bold text-dark-emphasis d-block small",
										style: { color: textColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faTriangleExclamation,
											className: "me-2 text-danger animate-pulse"
										}), "Bypass DND for High-Severity Alerts"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-muted",
										children: "Critical server-down incidents or FMS fraud warnings bypass DND schedules."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "form-check form-switch",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-check-input",
											type: "checkbox",
											disabled: !dndPrefs.dndEnabled,
											checked: dndPrefs.allowHighPriority,
											onChange: (e) => setDndPrefs({
												...dndPrefs,
												allowHighPriority: e.target.checked
											}),
											style: { cursor: "pointer" }
										})
									})]
								})
							]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4",
				style: { marginTop: 20 },
				children: footerStats.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: cardBg,
							borderRadius: radius,
							border: `1px solid ${borderColor}`,
							padding: "16px 20px",
							boxShadow: shadowSm,
							textAlign: "center"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 11,
								fontWeight: 600,
								color: mutedColor,
								letterSpacing: "0.04em",
								marginBottom: 6
							},
							children: f.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 18,
								fontWeight: 700,
								color: textColor
							},
							children: f.value
						})]
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: {
					backgroundColor: "rgba(0,0,0,0.55)",
					zIndex: 1050,
					backdropFilter: "blur(4px)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered modal-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							scale: .95,
							opacity: 0
						},
						animate: {
							scale: 1,
							opacity: 1
						},
						exit: {
							scale: .95,
							opacity: 0
						},
						className: `modal-content border-0 shadow-lg rounded-4 ${isDark ? "bg-dark text-white border border-secondary" : "bg-white"}`,
						style: {
							background: cardBg,
							borderColor
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-0",
								style: { color: textColor },
								children: modalMode === "add" ? "Create Notification Template" : "Edit Notification Template"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn border-0 text-muted",
								style: { background: "transparent" },
								onClick: () => setShowModal(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faTimes,
									size: "lg"
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: saveTemplateForm,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-body p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label small fw-bold text-muted uppercase",
												children: "Template Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												required: true,
												className: "form-control border-0 px-3 py-2.5 rounded-3 text-dark-emphasis",
												style: {
													background: inputBg,
													color: textColor
												},
												placeholder: "e.g. Leave Approval Request",
												value: formName,
												onChange: (e) => setFormName(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label small fw-bold text-muted uppercase",
												children: "Delivery Type"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select border-0 px-3 py-2.5 rounded-3 text-dark-emphasis",
												style: {
													background: inputBg,
													color: textColor
												},
												value: formType,
												onChange: (e) => setFormType(e.target.value),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Email" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "In-App" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "SMS" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Push" })
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label small fw-bold text-muted uppercase",
												children: "Workflow Channel"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select border-0 px-3 py-2.5 rounded-3 text-dark-emphasis",
												style: {
													background: inputBg,
													color: textColor
												},
												value: formChannel,
												onChange: (e) => setFormChannel(e.target.value),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "HRMS" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "PMS" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Payroll" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Finance" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "System" })
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label small fw-bold text-muted uppercase",
												children: "Initial Status"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select border-0 px-3 py-2.5 rounded-3 text-dark-emphasis",
												style: {
													background: inputBg,
													color: textColor
												},
												value: formStatus,
												onChange: (e) => setFormStatus(e.target.value),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Active" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Inactive" })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-12",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label small fw-bold text-muted uppercase",
												children: "Header Subject Line (Email/Push only)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control border-0 px-3 py-2.5 rounded-3 text-dark-emphasis",
												style: {
													background: inputBg,
													color: textColor
												},
												placeholder: "e.g. Leave Application Update",
												value: formSubject,
												onChange: (e) => setFormSubject(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-12",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex justify-content-between align-items-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label small fw-bold text-muted uppercase mb-1",
													children: "Body Text Content"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "x-small text-primary fw-bold",
													style: { cursor: "pointer" },
													onClick: () => setFormBody((prev) => prev + " {{employee_name}}"),
													children: "Insert variable tag"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												rows: 4,
												required: true,
												className: "form-control border-0 px-3 py-2.5 rounded-3 text-dark-emphasis",
												style: {
													background: inputBg,
													color: textColor,
													fontFamily: "monospace"
												},
												placeholder: "Write notification message content here... Use tags like {{employee_name}}, {{amount}}, {{date}} for dynamic binding.",
												value: formBody,
												onChange: (e) => setFormBody(e.target.value)
											})]
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 p-4 pt-0 d-flex justify-content-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn rounded-pill px-4 text-muted bg-opacity-10 bg-secondary",
									onClick: () => setShowModal(false),
									style: {
										fontSize: "13px",
										fontWeight: "bold"
									},
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn rounded-pill px-4 text-white border-0",
									style: {
										background: primaryGradient,
										fontSize: "13px",
										fontWeight: "bold"
									},
									children: modalMode === "add" ? "Create Template" : "Save Changes"
								})]
							})]
						})]
					})
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showPreviewModal && previewTemplate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: {
					backgroundColor: "rgba(0,0,0,0.6)",
					zIndex: 1050,
					backdropFilter: "blur(4px)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							scale: .95,
							opacity: 0
						},
						animate: {
							scale: 1,
							opacity: 1
						},
						exit: {
							scale: .95,
							opacity: 0
						},
						className: `modal-content border-0 shadow-lg rounded-4 ${isDark ? "bg-dark text-white border border-secondary" : "bg-white"}`,
						style: {
							background: cardBg,
							borderColor
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
									className: "fw-bold mb-0",
									style: { color: textColor },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faEye,
										className: "me-2 text-primary"
									}), "Mockup Preview"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn border-0 text-muted",
									style: { background: "transparent" },
									onClick: () => setShowPreviewModal(false),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faTimes,
										size: "lg"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "badge rounded-pill px-2.5 py-1 mb-3 text-uppercase",
										style: {
											backgroundColor: `${typeColors[previewTemplate.type]?.bg}`,
											color: typeColors[previewTemplate.type]?.text,
											fontSize: "11px",
											fontWeight: "700"
										},
										children: [previewTemplate.type, " Notification"]
									}),
									previewTemplate.type === "Email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-3 border p-3 bg-light text-dark-emphasis",
										style: {
											background: "#f8fafc",
											border: "1px solid #e2e8f0"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-bottom pb-2 mb-2 small text-muted",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-dark",
													children: "Subject:"
												}),
												" ",
												previewTemplate.subject || previewTemplate.name
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small",
											style: {
												whiteSpace: "pre-wrap",
												fontFamily: "sans-serif",
												color: "#334155"
											},
											children: previewTemplate.body.replace(/\{\{employee_name\}\}/g, "Alex Carter").replace(/\{\{month\}\}/g, "July 2026").replace(/\{\{days\}\}/g, "3")
										})]
									}) : previewTemplate.type === "SMS" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mx-auto rounded-4 border p-3 text-white",
										style: {
											background: "#1e293b",
											width: "280px",
											fontFamily: "monospace",
											position: "relative"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-center border-bottom pb-1 mb-2 text-muted x-small",
											children: "💬 MESSAGE PREVIEW"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-3 bg-primary p-2 text-white small",
											style: {
												fontSize: "12px",
												lineHeight: 1.3
											},
											children: previewTemplate.body.replace(/\{\{voucher_id\}\}/g, "VCH-9872").replace(/\{\{amount\}\}/g, "$450.00")
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-3 border p-3 text-dark d-flex gap-3 align-items-start",
										style: {
											background: "#ffffff",
											borderLeft: "4px solid #4f46e5",
											boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0",
											style: {
												width: 34,
												height: 34
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBell })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: { flex: 1 },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
												className: "fw-bold mb-1",
												style: {
													fontSize: "13px",
													color: "#1e293b"
												},
												children: previewTemplate.subject || "System Notification"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mb-0 text-muted",
												style: {
													fontSize: "11px",
													lineHeight: 1.3
												},
												children: previewTemplate.body.replace(/\{\{days\}\}/g, "2").replace(/\{\{start_date\}\}/g, "2026-07-20")
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 text-muted x-small text-center",
										children: [
											"* Placeholder tags like ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
												className: "text-primary",
												children: "{{employee_name}}"
											}),
											" have been replaced with simulated client data."
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-footer border-0 p-4 pt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-secondary rounded-pill px-4 mx-auto",
									onClick: () => setShowPreviewModal(false),
									style: {
										fontSize: "13px",
										fontWeight: "bold"
									},
									children: "Close Preview"
								})
							})
						]
					})
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
        .space-y-4 > * + * {
          margin-top: 1.25rem !important;
        }
        .space-y-2 > * + * {
          margin-top: 0.5rem !important;
        }
        .form-switch .form-check-input {
          width: 2.5em;
          height: 1.25em;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${borderColor}; border-radius: 3px; }
        .x-small { font-size: 11px; }
      ` } })
		]
	});
};
//#endregion
export { NotificationSettings as default };
