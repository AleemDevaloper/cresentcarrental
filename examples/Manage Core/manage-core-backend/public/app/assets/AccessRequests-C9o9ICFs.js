import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Al as client, Dl as require_jsx_runtime, kl as clearCache, ru as require_react } from "./ai-BHgPkVLC.js";
import { Et as FiUserPlus, G as FiCheck, Ot as FiX, at as FiInfo, ct as FiLock, ot as FiKey, xt as FiShield } from "./superadmin-Cn5Mt1aQ.js";
//#region src/pages/AdminDashboard/AccessRequests.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AccessRequests = () => {
	const [requests, setRequests] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		fetchAccessRequests();
	}, []);
	const fetchAccessRequests = async () => {
		setLoading(true);
		try {
			const res = await client.get("/approvals", { params: { view: "admin" } });
			const accessTypes = [
				"user_registration",
				"role_change",
				"dashboard_access",
				"account_reactivation",
				"access",
				"deletion"
			];
			setRequests((res.data?.data || []).filter((req) => accessTypes.includes(req.type)));
		} catch (err) {
			console.error("Error fetching access requests", err);
		} finally {
			setLoading(false);
		}
	};
	const handleAction = async (requestId, status) => {
		try {
			await client.patch(`/approvals/${requestId}`, {
				status,
				comment: `Access ${status === "approved" ? "granted" : "denied"} by administrator.`
			});
			clearCache("/approvals");
			fetchAccessRequests();
		} catch (err) {
			console.error("Error updating access request", err);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "access-requests-container p-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm mb-4",
				style: { borderRadius: "15px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
						className: "fw-bold mb-1 d-flex align-items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, { className: "text-primary" }), " Access & Identity Requests"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted small mb-0",
						children: "Manage system registration, role elevations, and specific resource access permissions."
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-12 text-center py-5",
					children: "Loading access requests..."
				}) : requests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-12 text-center py-5 text-muted",
					children: "No pending access requests."
				}) : requests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-6 col-lg-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100 transition hover-lift",
						style: { borderRadius: "15px" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-start mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2 rounded bg-primary-subtle text-primary",
										children: req.type === "user_registration" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUserPlus, { size: 20 }) : req.type === "role_change" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiKey, { size: 20 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiLock, { size: 20 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `badge bg-${req.status === "pending" ? "warning" : req.status === "approved" ? "success" : "danger"} px-2`,
										children: req.status?.toUpperCase()
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold text-capitalize mb-1",
									children: req.type?.replace("_", " ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "small text-muted mb-3",
									children: ["Requested by ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: req.requester?.name })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 bg-light rounded mb-3 border border-dashed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "extra-small text-muted mb-1 text-uppercase fw-bold",
										children: "Reason / Details"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "small",
										children: req.reason || "Requested standard access permissions."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex gap-2 mt-auto",
									children: req.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1",
										onClick: () => handleAction(req.id, "approved"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCheck, {}), " Approve"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-outline-danger btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1",
										onClick: () => handleAction(req.id, "rejected"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiX, {}), " Reject"]
									})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiInfo, {}), " View Record"]
									})
								})
							]
						})
					})
				}, req.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
                .bg-primary-subtle { background-color: #eef2ff !important; }
                .extra-small { font-size: 10px; }
                .hover-lift:hover { transform: translateY(-5px); }
                .border-dashed { border-style: dashed !important; }
            ` } })
		]
	});
};
//#endregion
export { AccessRequests as default };
