import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Ar as faFileAlt, Dl as require_jsx_runtime, Dr as faEyeSlash, Er as faEye, Go as faRightToBracket, _r as faEnvelope, aa as faKey, ba as faLock, bl as useApp, dn as faCircleInfo, hs as faShieldAlt, jo as faProjectDiagram, jt as faCalculator, nc as faTasks, ru as require_react, sn as faCircleCheck, tl as faUsers, vl as FontAwesomeIcon, xc as faTriangleExclamation, z as faArrowRightLong } from "./ai-BHgPkVLC.js";
import { ti as NotificationBox } from "./fms-BQz62Xux.js";
import { Nt as getHomeRouteForRole, Wt as useNavigate } from "./superadmin-Cn5Mt1aQ.js";
import { t as logo1_default } from "./index-BIWDRy6M.js";
//#region src/pages/auth/Login.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var Login = () => {
	const { login, addNotification, notifications, removeNotification } = useApp();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [fieldError, setFieldError] = (0, import_react.useState)("");
	const [rememberMe, setRememberMe] = (0, import_react.useState)(false);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [capsLockOn, setCapsLockOn] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const btnRef = (0, import_react.useRef)(null);
	const liveRef = (0, import_react.useRef)(null);
	const [forgotOpen, setForgotOpen] = (0, import_react.useState)(false);
	const [forgotEmail, setForgotEmail] = (0, import_react.useState)("");
	const [forgotSent, setForgotSent] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const savedEmail = localStorage.getItem("rememberedEmail");
		if (savedEmail) {
			setEmail(savedEmail);
			setRememberMe(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.getModifierState) setCapsLockOn(e.getModifierState("CapsLock"));
		};
		window.addEventListener("keyup", onKey);
		return () => window.removeEventListener("keyup", onKey);
	}, []);
	const validateEmail = (value) => {
		const v = (value || "").trim();
		if (!v) return "Please enter your corporate email address.";
		if (!EMAIL_RE.test(v)) return "That email address doesn't look right. Check for typos.";
		return "";
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		const emailErr = validateEmail(email);
		if (emailErr) {
			setFieldError(emailErr);
			setError("");
			return;
		}
		if (!password) {
			setError("Please enter your corporate credentials.");
			setFieldError("");
			return;
		}
		setSubmitting(true);
		if (liveRef?.current) liveRef.current.textContent = "Authenticating...";
		setError("");
		setFieldError("");
		try {
			if (rememberMe) localStorage.setItem("rememberedEmail", email);
			else localStorage.removeItem("rememberedEmail");
			const user = await login({
				email: email.trim(),
				password
			});
			if (liveRef?.current) liveRef.current.textContent = "Authentication successful";
			navigate(getHomeRouteForRole(user?.role));
		} catch (err) {
			setError(err?.message || "Authentication failed. Please check your credentials.");
			if (liveRef?.current) liveRef.current.textContent = "Authentication failed";
		} finally {
			setSubmitting(false);
			setTimeout(() => {
				if (liveRef?.current) liveRef.current.textContent = "";
			}, 2e3);
		}
	};
	const handleDemo = (demoEmail, demoPassword) => {
		setEmail(demoEmail);
		setPassword(demoPassword);
		setFieldError("");
		setError("");
		setShowPassword(false);
		addNotification(`Demo credentials loaded for ${demoEmail}.`, "info", 3500, { title: "Demo Access" });
	};
	const handleForgotSubmit = (e) => {
		e.preventDefault();
		const err = validateEmail(forgotEmail);
		if (err) {
			addNotification(err, "warning", 4e3, { title: "Forgot Password" });
			return;
		}
		setForgotSent(true);
		addNotification(`If an account exists for ${forgotEmail.trim()}, a reset link has been dispatched.`, "success", 5e3, { title: "Request Received" });
	};
	const modules = [
		{
			name: "PMS",
			icon: faProjectDiagram,
			desc: "Project Management",
			accent: "#818cf8",
			tint: "rgba(129,140,248,0.16)"
		},
		{
			name: "HRMS",
			icon: faUsers,
			desc: "Human Resources",
			accent: "#34d399",
			tint: "rgba(52,211,153,0.16)"
		},
		{
			name: "TaskMS",
			icon: faTasks,
			desc: "Task & Workflow",
			accent: "#38bdf8",
			tint: "rgba(56,189,248,0.16)"
		},
		{
			name: "DMS",
			icon: faFileAlt,
			desc: "Document Management",
			accent: "#fbbf24",
			tint: "rgba(251,191,36,0.16)"
		},
		{
			name: "AMS",
			icon: faCalculator,
			desc: "Accounting & Payroll",
			accent: "#f472b6",
			tint: "rgba(244,114,182,0.16)"
		},
		{
			name: "Security",
			icon: faShieldAlt,
			desc: "System Governance",
			accent: "#a78bfa",
			tint: "rgba(167,139,250,0.16)"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "login-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "login-particle login-particle--1",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "login-particle login-particle--2",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "login-particle login-particle--3",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "login-particle login-particle--4",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBox, {
				notifications,
				onClose: removeNotification
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "enterprise-container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "enterprise-container-inner",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "system-modules-sidebar login-command-side",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
									className: "hub-header",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "enterprise-badge",
											children: "ENTERPRISE COMMAND SUITE"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["Manage Core ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Control Center" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Secure access to the operational layer that connects projects, workforce, finance, documents, automation, and audit readiness." })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "module-grid",
									children: modules.map((mod, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "module-item",
										style: {
											"--item-index": idx,
											"--accent": mod.accent,
											"--accent-tint": mod.tint
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "module-icon-wrapper",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "module-icon",
												style: {
													background: mod.tint,
													color: mod.accent
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: mod.icon })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "module-content",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "module-name",
												children: mod.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "module-desc",
												children: mod.desc
											})]
										})]
									}, idx))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "login-system-pulse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pulse-track",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pulse-segment is-active" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pulse-segment is-active" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pulse-segment is-active" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pulse-segment is-active" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pulse-segment" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pulse-label",
										children: "All systems operational"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "login-insight-panel",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "99.9%" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Uptime SLA" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ISO" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ready controls" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "24/7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Audit visibility" })] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "login-compliance-note",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCircleCheck,
											style: {
												fontSize: "0.6rem",
												color: "#22c55e"
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SOC 2 Type II Certified" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "v5.2.0" })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "auth-form-section login-auth-panel",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
									className: "auth-header",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "logo-wrapper",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: logo1_default,
												alt: "Enterprise Logo"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "company-name",
												children: ["MANAGE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CORE" })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "auth-kicker",
											children: "Protected Workspace"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Welcome back" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sign in to continue to your assigned enterprise command center." })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSubmit,
									noValidate: true,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `corporate-input ${fieldError ? "has-error" : ""}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													htmlFor: "email",
													children: "Corporate Email"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group-custom",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faEnvelope,
														className: "icon"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														id: "email",
														type: "email",
														className: "form-control",
														value: email,
														onChange: (e) => {
															setEmail(e.target.value);
															if (fieldError) setFieldError("");
														},
														onBlur: (e) => {
															if (e.target.value && validateEmail(e.target.value)) setFieldError(validateEmail(e.target.value));
														},
														placeholder: "name@organization.com",
														autoComplete: "email",
														required: true,
														"aria-required": "true",
														"aria-invalid": !!fieldError,
														"aria-describedby": fieldError ? "email-error" : void 0
													})]
												}),
												fieldError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "field-error",
													id: "email-error",
													role: "alert",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTriangleExclamation }),
														" ",
														fieldError
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "corporate-input",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex justify-content-between align-items-center mb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														htmlFor: "password",
														children: "Secure Password"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: "forgot-link",
														onClick: () => {
															setForgotOpen(true);
															setForgotEmail(email);
															setForgotSent(false);
														},
														tabIndex: "0",
														children: "Forgot password?"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-group-custom",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faLock,
															className: "icon"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															id: "password",
															type: showPassword ? "text" : "password",
															className: "form-control",
															value: password,
															onChange: (e) => setPassword(e.target.value),
															placeholder: "\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022",
															autoComplete: "current-password",
															required: true,
															"aria-required": "true"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															className: "toggle-visibility",
															onClick: () => setShowPassword((prev) => !prev),
															tabIndex: "-1",
															"aria-label": showPassword ? "Hide password" : "Show password",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: showPassword ? faEyeSlash : faEye })
														})
													]
												}),
												capsLockOn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "caps-hint",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCircleInfo }), " Caps Lock is on. Passwords are case-sensitive."]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "form-options d-flex justify-content-start align-items-center mb-3 ms-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "form-check custom-check",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "form-check-input shadow-none",
													type: "checkbox",
													id: "rememberMe",
													checked: rememberMe,
													onChange: (e) => setRememberMe(e.target.checked)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-check-label",
													htmlFor: "rememberMe",
													children: "Remember my workstation"
												})]
											})
										}),
										error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "alert-enterprise",
											role: "alert",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "alert-icon",
												children: "⚠️"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "alert-message",
												children: error
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											ref: btnRef,
											type: "submit",
											className: "btn-enterprise btn-authenticate",
											disabled: submitting,
											"aria-live": "polite",
											"aria-busy": submitting,
											onClick: (e) => {
												const btn = btnRef.current;
												if (btn && !submitting) {
													const rect = btn.getBoundingClientRect();
													const span = document.createElement("span");
													span.className = "btn-ripple";
													span.style.left = e.clientX - rect.left + "px";
													span.style.top = e.clientY - rect.top + "px";
													btn.appendChild(span);
													setTimeout(() => {
														span.remove();
													}, 700);
												}
											},
											children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "auth-loading",
												role: "status",
												"aria-live": "polite",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
													className: "loader-ring",
													width: "36",
													height: "36",
													viewBox: "0 0 50 50",
													"aria-hidden": "true",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
														className: "ring-bg",
														cx: "25",
														cy: "25",
														r: "20",
														fill: "none",
														stroke: "rgba(255,255,255,0.12)",
														strokeWidth: "4"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
														className: "ring",
														cx: "25",
														cy: "25",
														r: "20",
														fill: "none",
														stroke: "white",
														strokeWidth: "4",
														strokeLinecap: "round"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "loader-text",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verifying" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "ellipsis",
														"aria-hidden": "true",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "." }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "." }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "." })
														]
													})]
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "btn-label",
												children: "Authenticate Session"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faRightToBracket,
												size: "sm",
												className: "btn-icon"
											})] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											ref: liveRef,
											className: "visually-hidden",
											"aria-live": "polite",
											"aria-atomic": "true"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "auth-demo",
									"aria-label": "Demo access",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "auth-demo-label",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faKey }), " Quick demo access"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "auth-demo-chips",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "auth-demo-chip",
											onClick: () => handleDemo("admin@managecore.test", "password123"),
											children: "Admin"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
									className: "auth-footer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "support-link",
										children: ["Need assistance? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "#",
											children: "Contact IT Support"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "copyright",
										children: [
											"© 2026 Manage Core Enterprise Management System",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"All rights reserved by Techshinners."
										]
									})]
								})
							]
						}),
						forgotOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "forgot-overlay",
							role: "dialog",
							"aria-modal": "true",
							"aria-labelledby": "forgot-title",
							onClick: (e) => {
								if (e.target === e.currentTarget) setForgotOpen(false);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "forgot-modal",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "forgot-close",
										"aria-label": "Close",
										onClick: () => setForgotOpen(false),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faArrowRightLong })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "forgot-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faKey })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										id: "forgot-title",
										children: "Reset your password"
									}),
									forgotSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "forgot-success",
										children: [
											"If an account exists for ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: forgotEmail.trim() }),
											", reset instructions have been sent to that inbox. Please check your email and follow the link to continue."
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "forgot-copy",
											children: "Enter the corporate email linked to your account and we\\u2019ll send you a secure recovery link."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "corporate-input",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: "forgot-email",
												children: "Corporate Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "input-group-custom",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faEnvelope,
													className: "icon"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													id: "forgot-email",
													type: "email",
													className: "form-control",
													value: forgotEmail,
													onChange: (e) => setForgotEmail(e.target.value),
													placeholder: "name@organization.com",
													autoComplete: "email",
													autoFocus: true
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "btn-enterprise",
											onClick: handleForgotSubmit,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send Reset Link" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faArrowRightLong })]
										})
									] })
								]
							})
						})
					]
				})
			})
		]
	});
};
//#endregion
export { Login as default };
