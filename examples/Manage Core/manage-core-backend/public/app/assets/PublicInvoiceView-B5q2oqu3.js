import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Ao as faPrint, Cn as faClock, Dl as require_jsx_runtime, Ur as faFileInvoice, ha as faLinkSlash, ru as require_react, vl as FontAwesomeIcon, xc as faTriangleExclamation } from "./ai-BHgPkVLC.js";
import { zr as getPublicSalesInvoice } from "./fms-BQz62Xux.js";
import { Gt as useParams } from "./superadmin-Cn5Mt1aQ.js";
//#region src/pages/public/PublicInvoiceView.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var STATUS_COLORS = {
	Paid: {
		bg: "#dcfce7",
		color: "#16a34a"
	},
	Sent: {
		bg: "#e0f2fe",
		color: "#0284c7"
	}
};
var PublicInvoiceView = () => {
	const { token } = useParams();
	const [invoice, setInvoice] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			try {
				setLoading(true);
				setError(null);
				setInvoice((await getPublicSalesInvoice(token)).data?.invoice || null);
			} catch (err) {
				setError(err.message || "Failed to load invoice.");
			} finally {
				setLoading(false);
			}
		})();
	}, [token]);
	const amountNumber = (value) => parseFloat(String(value || "").replace(/[^0-9.-]/g, "")) || 0;
	const formatMoney = (value) => {
		const n = amountNumber(value);
		return `${invoice?.currency || "USD"} ${n.toLocaleString(void 0, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})}`;
	};
	const handlePrint = () => window.print();
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: pageStyle,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "spinner-border",
				style: { color: "#6366f1" },
				role: "status"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: { ...mutedText },
				children: "Loading invoice..."
			})]
		})
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: pageStyle,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "card shadow-sm border-0 mx-auto text-center",
			style: {
				maxWidth: 420,
				borderRadius: 18
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-body p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: error.toLowerCase().includes("expired") ? faClock : error.toLowerCase().includes("revoked") ? faLinkSlash : faTriangleExclamation,
						size: "2x",
						style: {
							color: "#ef4444",
							marginBottom: 16
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
						className: "fw-bold mb-2",
						children: "Invoice unavailable"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted mb-0",
						style: { fontSize: "0.85rem" },
						children: error
					})
				]
			})
		})
	});
	if (!invoice) return null;
	const subtotal = amountNumber(invoice.amount);
	const statusColors = STATUS_COLORS[invoice.status] || {
		bg: "#fef3c7",
		color: "#d97706"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: { ...pageStyle },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@media print { .no-print { display: none !important; } body { background: #fff; } }` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-print d-flex justify-content-end mb-3",
				style: {
					maxWidth: 760,
					margin: "0 auto 18px",
					width: "100%"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handlePrint,
					className: "btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3",
					style: {
						borderRadius: 10,
						background: "linear-gradient(135deg, #6366f1, #4f46e5)",
						fontSize: "0.78rem"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPrint }), " Print / Save PDF"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card shadow-lg border-0",
				style: {
					maxWidth: 760,
					width: "100%",
					margin: "0 auto",
					borderRadius: 14,
					overflow: "hidden"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						background: "linear-gradient(135deg, #6366f1, #4f46e5)",
						color: "#fff",
						padding: "24px 28px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						flexWrap: "wrap",
						gap: 12
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
						style: {
							margin: 0,
							fontWeight: 800
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faFileInvoice,
							className: "me-2"
						}), "ManageCore"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							opacity: .85,
							fontSize: "0.72rem",
							marginTop: 4
						},
						children: "Corporate Invoicing — Accounting System (AMS)"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { textAlign: "right" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								style: {
									margin: 0,
									fontWeight: 800,
									letterSpacing: "0.04em",
									fontSize: "1.3rem"
								},
								children: "INVOICE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									opacity: .85,
									fontSize: "0.78rem"
								},
								children: invoice.number
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontWeight: 700,
									marginTop: 6
								},
								children: formatMoney(subtotal)
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body",
					style: { padding: "24px 28px" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-md-4 col-12",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#94a3b8",
											fontSize: "0.65rem",
											textTransform: "uppercase",
											letterSpacing: "0.5px"
										},
										children: "Bill To"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontWeight: 700,
											fontSize: "0.9rem"
										},
										children: invoice.customer
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-md-4 col-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#94a3b8",
											fontSize: "0.65rem",
											textTransform: "uppercase",
											letterSpacing: "0.5px"
										},
										children: "Issue Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: { fontSize: "0.9rem" },
										children: invoice.date
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-md-4 col-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#94a3b8",
											fontSize: "0.65rem",
											textTransform: "uppercase",
											letterSpacing: "0.5px"
										},
										children: "Due Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: { fontSize: "0.9rem" },
										children: invoice.due
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "table table-sm",
							style: { fontSize: "0.82rem" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								style: { borderBottom: "2px solid #6366f1" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Items"
								})]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [
								"Goods and services billed on this invoice (",
								invoice.billingMethod,
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-end",
								children: invoice.items ?? 1
							})] }) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex justify-content-end mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									width: 260,
									fontSize: "0.82rem"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between",
									style: {
										padding: "8px 0",
										borderTop: "1px solid #e2e8f0",
										color: "#6366f1",
										fontSize: "0.95rem"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Due" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatMoney(subtotal) })]
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center pt-3",
							style: { borderTop: "1px solid #e2e8f0" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "d-inline-flex align-items-center gap-1 px-3 py-1",
								style: {
									fontSize: "0.75rem",
									borderRadius: 20,
									background: statusColors.bg,
									color: statusColors.color
								},
								children: ["Status: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: invoice.status })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted mt-3 mb-0",
								style: { fontSize: "0.7rem" },
								children: "This invoice was shared securely via ManageCore AMS."
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "no-print text-center mt-4",
				style: {
					fontSize: "0.7rem",
					color: "#94a3b8"
				},
				children: "Powered by ManageCore — Manage Core Corporate Suite"
			})
		]
	});
};
var pageStyle = {
	minHeight: "100vh",
	background: "#f1f5f9",
	fontFamily: "'Inter', 'Segoe UI', sans-serif",
	color: "#1e293b",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	padding: "32px 16px"
};
var mutedText = {
	color: "#64748b",
	marginTop: 12,
	fontSize: "0.85rem"
};
//#endregion
export { PublicInvoiceView as default };
