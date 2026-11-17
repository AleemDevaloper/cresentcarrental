import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Al as client, Cn as faClock, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Ui as faHistory, _r as faEnvelope, bl as useApp, d as useTranslation, dc as faTimesCircle, kl as clearCache, ro as faPaperPlane, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import "./fms-BQz62Xux.js";
//#region src/pages/requests/UserRequests.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var UserRequests = () => {
	const { theme, currentUser, addNotification } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [activeSubTab, setActiveSubTab] = (0, import_react.useState)("new");
	const [requestType, setRequestType] = (0, import_react.useState)("general");
	const [description, setDescription] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [showSuccess, setShowSuccess] = (0, import_react.useState)(false);
	const [requestHistory, setRequestHistory] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const fetchHistory = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			setRequestHistory((await client.get("/approvals")).data?.data || []);
		} catch (err) {
			console.error("Error fetching request history", err);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchHistory();
	}, [fetchHistory]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!currentUser) {
			addNotification("Please wait for authentication to complete.", "error");
			return;
		}
		setIsSubmitting(true);
		try {
			await client.post("/approvals", {
				type: requestType,
				reason: description,
				approvable_id: currentUser.id,
				approvable_type: "App\\Models\\User",
				priority: "medium"
			});
			clearCache("/approvals");
			setIsSubmitting(false);
			setShowSuccess(true);
			addNotification("Request sent successfully!", "success");
			setDescription("");
			setTimeout(() => setShowSuccess(false), 5e3);
			fetchHistory();
		} catch (err) {
			console.error("Error submitting request", err);
			addNotification(err.message || "Failed to send request. Please try again.", "error");
			setIsSubmitting(false);
		}
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "approved": return "bg-success-subtle text-success";
			case "rejected": return "bg-danger-subtle text-danger";
			case "pending": return "bg-warning-subtle text-warning";
			default: return "bg-secondary-subtle text-secondary";
		}
	};
	const getStatusIcon = (status) => {
		switch (status) {
			case "approved": return faCheckCircle;
			case "rejected": return faTimesCircle;
			default: return faClock;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `user-requests-page ${isDark ? "dark-mode" : ""}`,
		style: { minHeight: "100vh" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-fluid py-4 px-lg-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm rounded-4 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-body p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex border-bottom",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: `flex-grow-1 py-3 border-0 bg-transparent transition fw-bold ${activeSubTab === "new" ? "text-primary border-bottom border-primary border-3" : "text-muted"}`,
									onClick: () => setActiveSubTab("new"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faPlus,
										className: "me-2"
									}), t("new_request")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: `flex-grow-1 py-3 border-0 bg-transparent transition fw-bold ${activeSubTab === "history" ? "text-primary border-bottom border-primary border-3" : "text-muted"}`,
									onClick: () => setActiveSubTab("history"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faHistory,
										className: "me-2"
									}), t("my_requests")]
								})]
							})
						})
					})
				})
			}), activeSubTab === "new" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card border-0 shadow-sm rounded-4 p-4 p-lg-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "fw-bold mb-4",
								children: t("send_request_to_admin")
							}),
							showSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "alert alert-success border-0 rounded-3 d-flex align-items-center mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faCheckCircle,
									className: "me-2"
								}), t("request_sent_success")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmit,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-bold small text-uppercase text-muted",
											children: t("request_type")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "form-select border-0 bg-light p-3 rounded-3",
											value: requestType,
											onChange: (e) => setRequestType(e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "general",
													children: t("general_support")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "deletion",
													children: t("account_deletion")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "access",
													children: t("access_permission_request")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "hardware",
													children: t("hardware_asset_request")
												})
											]
										})]
									}),
									requestType === "deletion" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "alert alert-warning border-0 rounded-3 mb-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faExclamationTriangle,
												className: "fs-4 mt-1"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
												className: "fw-bold mb-1",
												children: t("critical_action")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "small mb-0 opacity-75",
												children: t("deletion_warning")
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-bold small text-uppercase text-muted",
											children: t("request_description")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control border-0 bg-light p-3 rounded-3",
											rows: "5",
											placeholder: t("provide_details_placeholder"),
											value: description,
											onChange: (e) => setDescription(e.target.value),
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										className: "btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm transition hover-lift",
										disabled: isSubmitting,
										children: [isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner-border spinner-border-sm me-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faPaperPlane,
											className: "me-2"
										}), t("send_request")]
									})
								]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-4 mt-4 mt-lg-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card border-0 shadow-sm rounded-4 p-4 bg-primary text-white h-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faEnvelope,
								className: "fs-1 opacity-25 mb-4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-3",
								children: t("communication_policy")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small opacity-75 mb-4",
								children: t("policy_description")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "list-unstyled small opacity-75 mb-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "mb-2",
										children: ["• ", t("be_specific")]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "mb-2",
										children: ["• ", t("attach_docs")]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", t("urgent_matters")] })
								]
							})
						]
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm rounded-4 overflow-hidden fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "table table-hover align-middle mb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-light",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "ps-4 py-3 border-0 text-muted small text-uppercase fw-bold",
									children: t("request_id")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 border-0 text-muted small text-uppercase fw-bold",
									children: t("request_type")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 border-0 text-muted small text-uppercase fw-bold",
									children: t("date_sent")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 border-0 text-muted small text-uppercase fw-bold",
									children: t("status")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4 py-3 border-0 text-muted small text-uppercase fw-bold",
									children: t("admin_note")
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "5",
							className: "text-center py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border spinner-border-sm text-primary me-2" }), t("loading")]
						}) }) : requestHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "5",
							className: "text-center py-5 text-muted",
							children: t("no_requests_found")
						}) }) : requestHistory.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "ps-4 py-4 fw-bold text-primary",
								children: ["#REQ-00", req.id]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-capitalize",
								children: req.type?.replace("_", " ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-muted small",
								children: new Date(req.created_at).toLocaleDateString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `badge rounded-pill px-3 py-2 ${getStatusBadge(req.status)}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: getStatusIcon(req.status),
									className: "me-1"
								}), req.status]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "pe-4 text-muted small",
								children: req.approver_comment || t("no_notes_yet")
							})
						] }, req.id)) })]
					})
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
        .hover-lift { transition: transform 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      ` } })]
	});
};
//#endregion
export { UserRequests as default };
