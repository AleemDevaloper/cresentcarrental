import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Al as client, Dl as require_jsx_runtime, ru as require_react } from "./ai-BHgPkVLC.js";
import { $ as FiDownload, L as FiActivity, Tt as FiUser, W as FiCalendar, nt as FiFilter, vt as FiSearch } from "./superadmin-Cn5Mt1aQ.js";
//#region src/pages/AdminDashboard/AuditLogs.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AuditLogs = () => {
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		fetchLogs();
	}, []);
	const fetchLogs = async () => {
		setLoading(true);
		try {
			const res = await client.get("/approvals", { params: { view: "admin" } });
			const allLogs = [];
			res.data.data.forEach((req) => {
				if (req.history) req.history.forEach((h) => {
					allLogs.push({
						id: h.id,
						requestId: req.id,
						type: req.type,
						action: h.action,
						performedBy: h.user?.name,
						email: h.user?.email,
						timestamp: h.created_at,
						note: h.note
					});
				});
			});
			setLogs(allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
		} catch (err) {
			console.error("Error fetching audit logs", err);
		} finally {
			setLoading(false);
		}
	};
	const getActionBadge = (action) => {
		switch (action) {
			case "approved": return "success";
			case "rejected": return "danger";
			case "created": return "primary";
			case "escalated": return "purple";
			case "sent_back": return "warning";
			default: return "secondary";
		}
	};
	const filteredLogs = logs.filter((log) => log.performedBy?.toLowerCase().includes(searchTerm.toLowerCase()) || log.type?.toLowerCase().includes(searchTerm.toLowerCase()) || log.action?.toLowerCase().includes(searchTerm.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "audit-logs-container p-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm mb-4",
				style: { borderRadius: "15px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-center mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
							className: "fw-bold mb-0 d-flex align-items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiActivity, { className: "text-primary" }), " System Audit Logs"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-outline-primary btn-sm d-flex align-items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiDownload, {}), " Export CSV"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "input-group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "input-group-text bg-transparent border-end-0 text-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiSearch, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control border-start-0",
										placeholder: "Filter by user, action or type...",
										value: searchTerm,
										onChange: (e) => setSearchTerm(e.target.value)
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "input-group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "input-group-text bg-transparent border-end-0 text-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCalendar, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										className: "form-control border-start-0"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-light w-100 d-flex align-items-center justify-content-center gap-2",
									onClick: fetchLogs,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiFilter, {}), " Advanced Filter"]
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm overflow-hidden",
				style: { borderRadius: "15px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "table table-hover align-middle mb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-light",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "ps-4 py-3 text-muted small text-uppercase",
									children: "Timestamp"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 text-muted small text-uppercase",
									children: "Performed By"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 text-muted small text-uppercase",
									children: "Action"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 text-muted small text-uppercase",
									children: "Module / Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 text-muted small text-uppercase",
									children: "Request ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4 py-3 text-muted small text-uppercase",
									children: "Details"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "6",
							className: "text-center py-5",
							children: "Loading logs..."
						}) }) : filteredLogs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "6",
							className: "text-center py-5",
							children: "No logs found."
						}) }) : filteredLogs.map((log, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "ps-4 small",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-medium",
									children: new Date(log.timestamp).toLocaleDateString()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted extra-small",
									children: new Date(log.timestamp).toLocaleTimeString()
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "avatar rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0",
									style: {
										width: 28,
										height: 28
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUser, { className: "text-muted small" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-bold",
									children: log.performedBy
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "extra-small text-muted",
									children: log.email
								})] })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge bg-${getActionBadge(log.action)}-subtle text-${getActionBadge(log.action)} text-uppercase`,
								style: { fontSize: "10px" },
								children: log.action
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-capitalize small fw-medium",
								children: log.type.replace("_", " ")
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "fw-bold small",
								children: ["REQ-", 1e3 + log.requestId]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "pe-4 small text-muted",
								children: log.note || "Action performed on request."
							})
						] }, idx)) })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
                .extra-small { font-size: 10px; }
                .text-purple { color: #6f42c1; }
                .bg-purple-subtle { background-color: #f3e8ff; }
            ` } })
		]
	});
};
//#endregion
export { AuditLogs as default };
