import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Al as client, Dl as require_jsx_runtime, d as useTranslation, kl as clearCache, ru as require_react } from "./ai-BHgPkVLC.js";
import { J as FiClock, K as FiCheckCircle, L as FiActivity, R as FiAlertCircle, Tt as FiUser, Z as FiCornerUpRight, at as FiInfo, dt as FiMessageSquare, ft as FiMoreVertical, gt as FiRefreshCw, kt as FiXCircle, nt as FiFilter, q as FiChevronRight, vt as FiSearch, wt as FiTrendingUp, xt as FiShield, yt as FiSend } from "./superadmin-Cn5Mt1aQ.js";
//#region src/pages/AdminDashboard/ApprovalCenter.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ApprovalCenter = () => {
	const { t } = useTranslation();
	const [requests, setRequests] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [stats, setStats] = (0, import_react.useState)({
		pending: 0,
		approved_today: 0,
		rejected_today: 0,
		high_priority: 0
	});
	const [selectedRequest, setSelectedRequest] = (0, import_react.useState)(null);
	const [isDrawerOpen, setIsDrawerOpen] = (0, import_react.useState)(false);
	const [comment, setComment] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		status: "",
		type: "",
		priority: "",
		search: ""
	});
	(0, import_react.useEffect)(() => {
		fetchRequests();
		fetchStats();
	}, [
		filters.status,
		filters.type,
		filters.priority,
		filters.search
	]);
	const fetchRequests = async () => {
		setLoading(true);
		try {
			setRequests((await client.get("/approvals", { params: {
				...filters,
				view: "admin"
			} })).data?.data || []);
		} catch (err) {
			console.error("Error fetching requests", err);
		} finally {
			setLoading(false);
		}
	};
	const fetchStats = async () => {
		try {
			setStats((await client.get("/approvals/stats")).data);
		} catch (err) {
			console.error("Error fetching stats", err);
		}
	};
	const handleAction = async (requestId, status, actionComment = "") => {
		try {
			await client.patch(`/approvals/${requestId}`, {
				status,
				comment: actionComment || comment
			});
			clearCache("/approvals");
			setComment("");
			fetchRequests();
			fetchStats();
			if (selectedRequest && selectedRequest.id === requestId) setSelectedRequest((await client.get(`/approvals/${requestId}`)).data.data);
		} catch (err) {
			console.error("Error updating request", err);
		}
	};
	const getStatusColor = (status) => {
		switch (status) {
			case "pending": return "warning";
			case "approved": return "success";
			case "rejected": return "danger";
			case "in_review": return "info";
			case "escalated": return "purple";
			case "sent_back": return "orange";
			default: return "secondary";
		}
	};
	const getPriorityColor = (priority) => {
		switch (priority) {
			case "urgent": return "danger";
			case "high": return "warning";
			case "medium": return "primary";
			case "low": return "info";
			default: return "secondary";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "approval-center-container p-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						label: "Pending Requests",
						value: stats.pending,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiClock, {}),
						color: "#ffc107",
						bg: "rgba(255, 193, 7, 0.1)"
					},
					{
						label: "Approved Today",
						value: stats.approved_today,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCheckCircle, {}),
						color: "#198754",
						bg: "rgba(25, 135, 84, 0.1)"
					},
					{
						label: "Rejected Today",
						value: stats.rejected_today,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiXCircle, {}),
						color: "#dc3545",
						bg: "rgba(220, 53, 69, 0.1)"
					},
					{
						label: "High Priority",
						value: stats.high_priority,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiAlertCircle, {}),
						color: "#fd7e14",
						bg: "rgba(253, 126, 20, 0.1)"
					},
					{
						label: "Avg. Response",
						value: "2.4h",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiTrendingUp, {}),
						color: "#0dcaf0",
						bg: "rgba(13, 202, 240, 0.1)"
					}
				].map((card, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: { borderRadius: "15px" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-circle d-flex align-items-center justify-content-center",
								style: {
									width: 45,
									height: 45,
									backgroundColor: card.bg,
									color: card.color
								},
								children: card.icon
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted small fw-medium",
								children: card.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fs-4 fw-bold",
								style: { color: "var(--text-main)" },
								children: card.value
							})] })]
						})
					})
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm mb-4",
				style: { borderRadius: "15px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-body",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "input-group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "input-group-text bg-transparent border-end-0 text-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiSearch, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control border-start-0",
										placeholder: "Search by ID, Requester or Type...",
										value: filters.search,
										onChange: (e) => setFilters({
											...filters,
											search: e.target.value
										})
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select",
									value: filters.type,
									onChange: (e) => setFilters({
										...filters,
										type: e.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "All Types"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "leave_request",
											children: "Leave Request"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "expense",
											children: "Expense Approval"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "role_change",
											children: "Role Change"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "user_registration",
											children: "User Registration"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "asset_deletion",
											children: "Asset Deletion"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select",
									value: filters.status,
									onChange: (e) => setFilters({
										...filters,
										status: e.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "All Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "pending",
											children: "Pending"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "approved",
											children: "Approved"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "rejected",
											children: "Rejected"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "in_review",
											children: "In Review"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select",
									value: filters.priority,
									onChange: (e) => setFilters({
										...filters,
										priority: e.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "All Priority"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "urgent",
											children: "Urgent"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "high",
											children: "High"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "medium",
											children: "Medium"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "low",
											children: "Low"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-2 d-flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2",
									onClick: () => fetchRequests(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiFilter, {}), " Filter"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-light",
									onClick: () => setFilters({
										status: "",
										type: "",
										priority: "",
										search: ""
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiRefreshCw, {})
								})]
							})
						]
					})
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
									children: "Request ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 text-muted small text-uppercase",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 text-muted small text-uppercase",
									children: "Requested By"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 text-muted small text-uppercase",
									children: "Priority"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 text-muted small text-uppercase",
									children: "Submitted Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 text-muted small text-uppercase",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4 py-3 text-end text-muted small text-uppercase",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "7",
							className: "text-center py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border spinner-border-sm text-primary me-2" }), "Loading requests..."]
						}) }) : requests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "7",
							className: "text-center py-5 text-muted",
							children: "No requests found matching filters."
						}) }) : requests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							onClick: () => {
								setSelectedRequest(req);
								setIsDrawerOpen(true);
							},
							style: { cursor: "pointer" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "ps-4 fw-bold",
									children: ["REQ-", 1e3 + req.id]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-capitalize",
									children: req.type?.replace("_", " ")
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "avatar rounded-circle bg-light d-flex align-items-center justify-content-center",
										style: {
											width: 32,
											height: 32
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUser, { className: "text-muted" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-medium small",
										children: req.requester?.name || "Unknown"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted extra-small",
										children: req.requester?.email
									})] })]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `badge bg-${getPriorityColor(req.priority)}-subtle text-${getPriorityColor(req.priority)} text-uppercase px-2`,
									style: { fontSize: "10px" },
									children: req.priority
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "small text-muted",
									children: new Date(req.created_at).toLocaleDateString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `badge bg-${getStatusColor(req.status)} px-3 rounded-pill fw-medium`,
									style: { fontSize: "11px" },
									children: req.status?.replace("_", " ")
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "pe-4 text-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-icon btn-light rounded-circle",
										onClick: (e) => {
											e.stopPropagation();
											setSelectedRequest(req);
											setIsDrawerOpen(true);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiChevronRight, {})
									})
								})
							]
						}, req.id)) })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `drawer-overlay ${isDrawerOpen ? "show" : ""}`,
				onClick: () => setIsDrawerOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `request-drawer p-0 ${isDrawerOpen ? "open" : ""}`,
				style: {
					width: "450px",
					backgroundColor: "var(--card-bg)"
				},
				children: selectedRequest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-column h-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-bottom bg-light d-flex justify-content-between align-items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "mb-1 fw-bold",
								children: "Request Details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted small",
								children: [
									"REQ-",
									1e3 + selectedRequest.id,
									" • Submitted on ",
									new Date(selectedRequest.created_at).toLocaleDateString()
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setIsDrawerOpen(false)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-grow-1 overflow-auto p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4 d-flex justify-content-between align-items-center p-3 rounded bg-light border border-dashed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted fw-medium",
										children: "Current Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `badge bg-${getStatusColor(selectedRequest.status)} px-3 py-2 rounded-pill`,
										children: selectedRequest.status?.replace("_", " ").toUpperCase()
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
										className: "fw-bold mb-3 d-flex align-items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiInfo, { className: "text-primary" }), " Request Information"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 border rounded shadow-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-muted small d-block",
													children: "Type"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "fw-medium text-capitalize",
													children: selectedRequest.type?.replace("_", " ")
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-muted small d-block",
													children: "Requester"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "fw-medium",
													children: selectedRequest.requester?.name
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-muted small d-block",
													children: "Reason"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mb-0 small",
													children: selectedRequest.reason || "No reason provided."
												})]
											}),
											selectedRequest.metadata && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 p-2 bg-light rounded border",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-muted small d-block mb-1",
													children: "Additional Details"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
													className: "extra-small mb-0",
													style: { whiteSpace: "pre-wrap" },
													children: JSON.stringify(selectedRequest.metadata, null, 2)
												})]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
										className: "fw-bold mb-3 d-flex align-items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiActivity, { className: "text-primary" }), " Approval History"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "timeline ps-3",
										children: [selectedRequest.history?.map((entry, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "timeline-item position-relative pb-3 ps-4 border-start",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "timeline-marker position-absolute rounded-circle bg-primary",
													style: {
														width: 10,
														height: 10,
														left: -5,
														top: 5
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "small fw-bold text-capitalize",
													children: [
														entry.action,
														" by ",
														entry.user?.name
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "extra-small text-muted mb-1",
													children: new Date(entry.created_at).toLocaleString()
												}),
												entry.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "extra-small p-2 bg-light rounded",
													children: entry.note
												})
											]
										}, idx)), (!selectedRequest.history || selectedRequest.history.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small text-muted",
											children: "No history recorded yet."
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
											className: "fw-bold mb-3 d-flex align-items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiMessageSquare, { className: "text-primary" }), " Comments"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "comments-list mb-3",
											children: selectedRequest.comments?.map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex gap-2 mb-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "avatar rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0",
													style: {
														width: 28,
														height: 28
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUser, { className: "text-muted small" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "bg-light p-2 rounded flex-grow-1 border",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex justify-content-between align-items-center mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "fw-bold extra-small",
															children: c.user?.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted extra-small",
															children: new Date(c.created_at).toLocaleTimeString()
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "small",
														children: c.comment
													})]
												})]
											}, idx))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "input-group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control",
												placeholder: "Add a comment...",
												value: comment,
												onChange: (e) => setComment(e.target.value),
												onKeyPress: (e) => e.key === "Enter" && handleAction(selectedRequest.id, selectedRequest.status, comment)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-primary",
												onClick: () => handleAction(selectedRequest.id, selectedRequest.status, comment),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiSend, {})
											})]
										})
									]
								})
							]
						}),
						selectedRequest.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-top bg-white d-flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2",
									onClick: () => handleAction(selectedRequest.id, "approved"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCheckCircle, {}), " Approve"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2",
									onClick: () => handleAction(selectedRequest.id, "rejected"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiXCircle, {}), " Reject"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "dropdown",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-light",
										"data-bs-toggle": "dropdown",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiMoreVertical, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "dropdown-menu dropdown-menu-end shadow border-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "dropdown-item d-flex align-items-center gap-2 py-2",
											onClick: () => handleAction(selectedRequest.id, "sent_back"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, { className: "text-warning" }), " Send Back"]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "dropdown-item d-flex align-items-center gap-2 py-2",
											onClick: () => handleAction(selectedRequest.id, "escalated"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCornerUpRight, { className: "text-purple" }), " Escalate"]
										}) })]
									})]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
                .request-drawer {
                    position: fixed;
                    right: -450px;
                    top: 0;
                    bottom: 0;
                    z-index: 1050;
                    transition: right 0.3s ease;
                    box-shadow: -5px 0 25px rgba(0,0,0,0.1);
                }
                .request-drawer.open { right: 0; }
                .drawer-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.3);
                    z-index: 1040;
                    display: none;
                    backdrop-filter: blur(2px);
                }
                .drawer-overlay.show { display: block; }
                .text-purple { color: #6f42c1; }
                .bg-purple { background-color: #6f42c1; }
                .extra-small { font-size: 10px; }
                .avatar { font-size: 14px; }
                .timeline-marker { z-index: 1; border: 2px solid white; }
                .timeline-item:last-child { border-left: none !important; }
                .border-dashed { border-style: dashed !important; }
            ` } })
		]
	});
};
//#endregion
export { ApprovalCenter as default };
