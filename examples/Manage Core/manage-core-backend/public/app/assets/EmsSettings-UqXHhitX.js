import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { As as faSms, Ci as faGraduationCap, Cn as faClock, Ct as faBuilding, Dl as require_jsx_runtime, In as faCog, Kc as faUserLock, Qi as faImage, _r as faEnvelope, aa as faKey, bl as useApp, ca as faLanguage, d as useTranslation, hs as faShieldAlt, ir as faDollarSign, ot as faBell, po as faPercent, rs as faSave, ru as require_react, vl as FontAwesomeIcon, za as faMobileAlt } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/EmsSettings.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var EmsSettings = () => {
	const { theme, addNotification } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [settings, setSettings] = (0, import_react.useState)({
		general: {
			institutionName: "ManageCore University",
			logo: "",
			language: "en",
			timezone: "Asia/Karachi",
			currency: "PKR"
		},
		academic: {
			gradingSystem: "GPA (4.0)",
			passingCriteria: "40%",
			attendanceRule: "75% minimum",
			semesterSystem: "Semester"
		},
		notifications: {
			email: true,
			sms: true,
			push: false,
			feeReminders: true,
			attendanceAlerts: true,
			examNotifications: true
		},
		security: {
			passwordPolicy: "Strong",
			sessionTimeout: "30",
			twoFactor: false,
			maxLoginAttempts: "5"
		}
	});
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	const handleSave = () => {
		addNotification?.("Settings saved successfully", "success");
	};
	const SectionHeader = ({ icon, title, description }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex align-items-center gap-3 mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-2 rounded-3",
			style: { background: `${colors.primary}15` },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon,
				style: {
					color: colors.primary,
					fontSize: "16px"
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
			className: "fw-bold mb-0",
			style: { color: textColor },
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "x-small",
			style: { color: mutedColor },
			children: description
		})] })]
	});
	const FormField = ({ label, icon, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "small fw-bold text-muted mb-2",
			children: [icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon,
				className: "me-1"
			}), label]
		}), children]
	});
	const Toggle = ({ label, value, onChange }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex align-items-center justify-content-between py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "small fw-semibold",
			style: { color: textColor },
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "form-check form-switch mb-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "form-check-input",
				type: "checkbox",
				checked: value,
				onChange: (e) => onChange(e.target.checked),
				style: {
					cursor: "pointer",
					width: "40px",
					height: "20px"
				}
			})
		})]
	});
	const colors = {
		primary: "#6366f1",
		success: "#10b981",
		warning: "#f59e0b",
		danger: "#ef4444",
		info: "#06b6d4"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "text-white" : ""}`,
		style: {
			background: isDark ? "linear-gradient(135deg, #060816 0%, #111827 45%, #111c2f 100%)" : "linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #eef2ff 100%)",
			minHeight: "100vh"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `rounded-4 p-4 mb-4 border-0 shadow-sm ${isDark ? "bg-dark border border-secondary" : "bg-white"}`,
				style: {
					background: isDark ? "rgba(17,24,39,0.95)" : "rgba(255,255,255,0.92)",
					border: `1px solid ${borderColor}`,
					boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap align-items-center justify-content-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 rounded-4",
							style: {
								background: "rgba(99,102,241,0.12)",
								color: colors.primary
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCog,
								size: "xl"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "fw-bold mb-1",
							children: "EMS Settings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
							children: "Configure institutional preferences and policies"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-3 px-4 d-flex align-items-center gap-2",
						onClick: handleSave,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSave }), " Save Settings"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-lg-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								icon: faBuilding,
								title: "General Settings",
								description: "Basic institution information"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: "Institution Name",
								icon: faBuilding,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
									value: settings.general.institutionName,
									onChange: (e) => setSettings({
										...settings,
										general: {
											...settings.general,
											institutionName: e.target.value
										}
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "row g-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-md-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Language",
											icon: faLanguage,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
												value: settings.general.language,
												onChange: (e) => setSettings({
													...settings,
													general: {
														...settings.general,
														language: e.target.value
													}
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "en",
													children: "English"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "ur",
													children: "Urdu"
												})]
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-md-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Timezone",
											icon: faClock,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
												value: settings.general.timezone,
												onChange: (e) => setSettings({
													...settings,
													general: {
														...settings.general,
														timezone: e.target.value
													}
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Asia/Karachi",
													children: "Asia/Karachi"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Asia/Dubai",
													children: "Asia/Dubai"
												})]
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-md-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Currency",
											icon: faDollarSign,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
												value: settings.general.currency,
												onChange: (e) => setSettings({
													...settings,
													general: {
														...settings.general,
														currency: e.target.value
													}
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "PKR",
													children: "PKR (Rs.)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "USD",
													children: "USD ($)"
												})]
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-md-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											label: "Logo",
											icon: faImage,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`
											})
										})
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							icon: faShieldAlt,
							title: "Security Settings",
							description: "Authentication and access policies"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Password Policy",
										icon: faKey,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
											value: settings.security.passwordPolicy,
											onChange: (e) => setSettings({
												...settings,
												security: {
													...settings.security,
													passwordPolicy: e.target.value
												}
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Weak",
													children: "Weak"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Medium",
													children: "Medium"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Strong",
													children: "Strong"
												})
											]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Session Timeout (minutes)",
										icon: faClock,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
											value: settings.security.sessionTimeout,
											onChange: (e) => setSettings({
												...settings,
												security: {
													...settings.security,
													sessionTimeout: e.target.value
												}
											})
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Max Login Attempts",
										icon: faUserLock,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
											value: settings.security.maxLoginAttempts,
											onChange: (e) => setSettings({
												...settings,
												security: {
													...settings.security,
													maxLoginAttempts: e.target.value
												}
											})
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Two-Factor Authentication",
										value: settings.security.twoFactor,
										onChange: (v) => setSettings({
											...settings,
											security: {
												...settings.security,
												twoFactor: v
											}
										})
									})
								})
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-lg-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							icon: faGraduationCap,
							title: "Academic Settings",
							description: "Grading and academic policies"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Grading System",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
											value: settings.academic.gradingSystem,
											onChange: (e) => setSettings({
												...settings,
												academic: {
													...settings.academic,
													gradingSystem: e.target.value
												}
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "GPA (4.0)",
													children: "GPA (4.0)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "GPA (5.0)",
													children: "GPA (5.0)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Percentage",
													children: "Percentage"
												})
											]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Passing Criteria",
										icon: faPercent,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
											value: settings.academic.passingCriteria,
											onChange: (e) => setSettings({
												...settings,
												academic: {
													...settings.academic,
													passingCriteria: e.target.value
												}
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "40%",
													children: "40%"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "50%",
													children: "50%"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "60%",
													children: "60%"
												})
											]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Attendance Rule",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
											value: settings.academic.attendanceRule,
											onChange: (e) => setSettings({
												...settings,
												academic: {
													...settings.academic,
													attendanceRule: e.target.value
												}
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "75% minimum",
													children: "75% minimum"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "80% minimum",
													children: "80% minimum"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "85% minimum",
													children: "85% minimum"
												})
											]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Semester System",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
											value: settings.academic.semesterSystem,
											onChange: (e) => setSettings({
												...settings,
												academic: {
													...settings.academic,
													semesterSystem: e.target.value
												}
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Semester",
													children: "Semester"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Annual",
													children: "Annual"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Quarter",
													children: "Quarter"
												})
											]
										})
									})
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							icon: faBell,
							title: "Notification Settings",
							description: "Configure communication channels"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									label: "Email Notifications",
									icon: faEnvelope,
									value: settings.notifications.email,
									onChange: (v) => setSettings({
										...settings,
										notifications: {
											...settings.notifications,
											email: v
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									label: "SMS Notifications",
									icon: faSms,
									value: settings.notifications.sms,
									onChange: (v) => setSettings({
										...settings,
										notifications: {
											...settings.notifications,
											sms: v
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									label: "Push Notifications",
									icon: faMobileAlt,
									value: settings.notifications.push,
									onChange: (v) => setSettings({
										...settings,
										notifications: {
											...settings.notifications,
											push: v
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { style: { borderColor } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									label: "Fee Reminders",
									value: settings.notifications.feeReminders,
									onChange: (v) => setSettings({
										...settings,
										notifications: {
											...settings.notifications,
											feeReminders: v
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									label: "Attendance Alerts",
									value: settings.notifications.attendanceAlerts,
									onChange: (v) => setSettings({
										...settings,
										notifications: {
											...settings.notifications,
											attendanceAlerts: v
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									label: "Exam Notifications",
									value: settings.notifications.examNotifications,
									onChange: (v) => setSettings({
										...settings,
										notifications: {
											...settings.notifications,
											examNotifications: v
										}
									})
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.x-small { font-size: 11px; }` })
		]
	});
};
//#endregion
export { EmsSettings as default };
