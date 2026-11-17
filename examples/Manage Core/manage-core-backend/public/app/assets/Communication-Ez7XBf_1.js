import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { As as faSms, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Lc as faUser, Yo as faRotate, _r as faEnvelope, bl as useApp, d as useTranslation, da as faLayerGroup, ot as faBell, ro as faPaperPlane, ru as require_react, tl as faUsers, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { R as listCommunications, o as createCommunication } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Students/Communication.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var Communication = () => {
	const { t } = useTranslation();
	const { addNotification, theme } = useApp();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [filterType, setFilterType] = (0, import_react.useState)("");
	const [filterDateFrom, setFilterDateFrom] = (0, import_react.useState)("");
	const [filterDateTo, setFilterDateTo] = (0, import_react.useState)("");
	const [recipientFilter, setRecipientFilter] = (0, import_react.useState)("");
	const [sendForm, setSendForm] = (0, import_react.useState)({
		recipient_type: "student",
		recipient_id: "",
		subject: "",
		message: "",
		type: "email"
	});
	const fetchData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (filterType) params.type = filterType;
			if (filterDateFrom) params.date_from = filterDateFrom;
			if (filterDateTo) params.date_to = filterDateTo;
			if (recipientFilter) params.recipient = recipientFilter;
			const data = await listCommunications(params);
			setData(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message || "Failed to load communications");
		} finally {
			setLoading(false);
		}
	}, [
		filterType,
		filterDateFrom,
		filterDateTo,
		recipientFilter
	]);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [fetchData]);
	const handleSend = async (e) => {
		e.preventDefault();
		if (!sendForm.subject || !sendForm.message) {
			addNotification?.("Subject and message are required", "warning");
			return;
		}
		try {
			await createCommunication(sendForm);
			addNotification?.("Message sent successfully", "success");
			setSendForm({
				recipient_type: "student",
				recipient_id: "",
				subject: "",
				message: "",
				type: "email"
			});
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Failed to send message", "danger");
		}
	};
	const getTypeIcon = (type) => {
		switch (type) {
			case "email": return faEnvelope;
			case "sms": return faSms;
			case "push": return faBell;
			default: return faPaperPlane;
		}
	};
	const getTypeBadge = (type) => {
		const colors = {
			email: "primary",
			sms: "success",
			push: "warning"
		};
		return `bg-${colors[type] || "secondary"}-subtle text-${colors[type] || "secondary"}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "d-flex align-items-center justify-content-between mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Communication Center"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Send messages to students and parents"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
							className: "fw-bold mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPaperPlane,
								className: "me-2 text-primary"
							}), "Send Message"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSend,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "small fw-bold text-muted mb-2",
										children: "Recipient Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "d-flex gap-2",
										children: [
											"student",
											"parent",
											"class",
											"department"
										].map((rt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: `btn btn-sm rounded-3 fw-semibold ${sendForm.recipient_type === rt ? "btn-primary" : isDark ? "btn-outline-light" : "btn-outline-secondary"}`,
											onClick: () => setSendForm({
												...sendForm,
												recipient_type: rt
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: rt === "student" ? faUser : rt === "parent" ? faUsers : rt === "class" ? faUser : faLayerGroup,
												className: "me-1"
											}), rt.charAt(0).toUpperCase() + rt.slice(1)]
										}, rt))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "small fw-bold text-muted mb-2",
										children: "Recipient"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
										value: sendForm.recipient_id,
										onChange: (e) => setSendForm({
											...sendForm,
											recipient_id: e.target.value
										}),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: "",
											children: ["Select ", sendForm.recipient_type]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "small fw-bold text-muted mb-2",
										children: "Communication Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "d-flex gap-2",
										children: [
											"email",
											"sms",
											"push"
										].map((ct) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: `btn btn-sm rounded-3 fw-semibold ${sendForm.type === ct ? "btn-primary" : isDark ? "btn-outline-light" : "btn-outline-secondary"}`,
											onClick: () => setSendForm({
												...sendForm,
												type: ct
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: getTypeIcon(ct),
												className: "me-1"
											}), ct.toUpperCase()]
										}, ct))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "small fw-bold text-muted mb-2",
										children: "Subject"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
										value: sendForm.subject,
										onChange: (e) => setSendForm({
											...sendForm,
											subject: e.target.value
										}),
										placeholder: "Message subject..."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "small fw-bold text-muted mb-2",
										children: "Message"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: `form-control rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
										rows: "4",
										value: sendForm.message,
										onChange: (e) => setSendForm({
											...sendForm,
											message: e.target.value
										}),
										placeholder: "Type your message here..."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "btn btn-primary w-100 rounded-3 py-2 fw-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faPaperPlane,
										className: "me-2"
									}), "Send Message"]
								})
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
								className: "fw-bold mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faEnvelope,
									className: "me-2 text-info"
								}), "Communication History"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "row g-2 mb-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: `form-select form-select-sm rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
											value: filterType,
											onChange: (e) => setFilterType(e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "All Types"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "email",
													children: "Email"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "sms",
													children: "SMS"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "push",
													children: "Push"
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											className: `form-control form-control-sm rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
											value: filterDateFrom,
											onChange: (e) => setFilterDateFrom(e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											className: `form-control form-control-sm rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
											value: filterDateTo,
											onChange: (e) => setFilterDateTo(e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-outline-secondary rounded-3",
											onClick: () => {
												setFilterType("");
												setFilterDateFrom("");
												setFilterDateTo("");
												setRecipientFilter("");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faRotate })
										})
									})
								]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExclamationTriangle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "table-responsive",
								style: { maxHeight: "400px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "table table-hover align-middle mb-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "To" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Subject" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: "5",
										className: "text-center py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border spinner-border-sm text-primary" })
									}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: "5",
										className: "text-center py-4 text-muted",
										children: "No communications yet"
									}) }) : data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small",
											children: item.created_at || "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small fw-semibold",
											children: item.recipient_name || "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `badge rounded-pill ${getTypeBadge(item.type)}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: getTypeIcon(item.type),
												className: "me-1"
											}), item.type]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small",
											children: item.subject
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge rounded-pill bg-${item.status === "sent" ? "success" : item.status === "failed" ? "danger" : "warning"}-subtle text-${item.status === "sent" ? "success" : item.status === "failed" ? "danger" : "warning"}`,
											children: item.status || "pending"
										}) })
									] }, item.id)) })]
								})
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .x-small { font-size: 11px; }
      ` })
		]
	});
};
//#endregion
export { Communication as default };
