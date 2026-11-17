import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, Er as faEye, Qt as faCheck, Sl as useTableTheme, Yt as faChartLine, bl as useApp, da as faLayerGroup, hr as faEllipsisV, lo as faPenToSquare, no as faPalette, nr as faDiceD6, ru as require_react, vl as FontAwesomeIcon, xl as TABLE_THEMES } from "./ai-BHgPkVLC.js";
//#region src/pages/theme/TableComponents.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PREVIEW_ROWS = [
	{
		id: "EMP-1041",
		name: "Ayesha Khan",
		role: "Finance Lead",
		initials: "AK",
		status: "Active",
		amount: "$48,920",
		utilization: 82
	},
	{
		id: "EMP-1042",
		name: "Daniel Cruz",
		role: "FX Analyst",
		initials: "DC",
		status: "Pending",
		amount: "$12,430",
		utilization: 46
	},
	{
		id: "EMP-1043",
		name: "Sofia Ahmed",
		role: "Treasury Ops",
		initials: "SA",
		status: "Review",
		amount: "$73,110",
		utilization: 91
	},
	{
		id: "EMP-1044",
		name: "Marcus Reed",
		role: "Risk Officer",
		initials: "MR",
		status: "Active",
		amount: "$9,875",
		utilization: 34
	}
];
var statusStyle = (status, isDark) => {
	const map = {
		Active: isDark ? {
			bg: "#064e3b",
			fg: "#4ade80",
			dot: "#4ade80"
		} : {
			bg: "#dcfce7",
			fg: "#16a34a",
			dot: "#16a34a"
		},
		Pending: isDark ? {
			bg: "#713f12",
			fg: "#facc15",
			dot: "#facc15"
		} : {
			bg: "#fef9c3",
			fg: "#ca8a04",
			dot: "#ca8a04"
		},
		Review: isDark ? {
			bg: "#1e3a5f",
			fg: "#60a5fa",
			dot: "#60a5fa"
		} : {
			bg: "#dbeafe",
			fg: "#1d4ed8",
			dot: "#1d4ed8"
		}
	};
	return map[status] || map.Active;
};
var TablePreview = ({ themeId }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	"data-mc-theme": themeId,
	className: "mc-table-wrapper rounded-3 overflow-hidden",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
		className: "table align-middle mb-0 mc-table",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Employee" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
				className: "text-end",
				children: "Amount"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Utilization" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
				className: "text-center",
				children: "Actions"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: PREVIEW_ROWS.map((row) => {
			const sc = statusStyle(row.status, false);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mc-avatar",
						style: { background: `linear-gradient(135deg, ${themeId === "obsidian" ? "#38bdf8" : "#6366f1"}, ${themeId === "obsidian" ? "#0ea5e9" : "#8b5cf6"})` },
						children: row.initials
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "fw-semibold",
						style: { fontSize: "0.78rem" },
						children: row.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: "0.66rem",
							opacity: .65
						},
						children: row.role
					})] })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mc-status-pill",
					style: {
						background: sc.bg,
						color: sc.fg
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mc-dot",
						style: { background: sc.dot }
					}), row.status]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "text-end fw-semibold",
					style: {
						fontSize: "0.78rem",
						fontFamily: "monospace"
					},
					children: row.amount
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mc-progress",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${row.utilization}%` } })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						style: {
							fontSize: "0.66rem",
							opacity: .75
						},
						children: [row.utilization, "%"]
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mc-row-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								title: "View",
								style: {
									color: "#3b82f6",
									background: "rgba(59,130,246,0.12)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEye })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								title: "Edit",
								style: {
									color: "#f59e0b",
									background: "rgba(245,158,11,0.12)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPenToSquare })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								title: "More",
								style: {
									color: "#64748b",
									background: "rgba(100,116,139,0.14)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEllipsisV })
							})
						]
					})
				})
			] }, row.id);
		}) })]
	})
});
var TableComponents = () => {
	const { theme, addNotification } = useApp();
	const { themeId, setTheme } = useTableTheme();
	const [applyingId, setApplyingId] = (0, import_react.useState)(null);
	const isDark = theme === "dark";
	const containerBg = isDark ? "linear-gradient(135deg, #0f172a 0%, #111827 100%)" : "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)";
	const cardBg = isDark ? "rgba(30, 41, 59, 0.75)" : "rgba(255, 255, 255, 0.85)";
	const borderColor = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
	const textColor = isDark ? "#f1f5f9" : "#0f172a";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const handleApply = (id) => {
		setApplyingId(id);
		setTimeout(() => {
			setTheme(id);
			setApplyingId(null);
			addNotification(`${TABLE_THEMES.find((t) => t.id === id)?.name || id} table theme applied across all data tables`, "success", 3500, { title: "Table Theme Updated" });
		}, 300);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			background: containerBg,
			minHeight: "100vh",
			padding: "1.5rem",
			fontFamily: "'Inter', sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .tc-card {
          background: ${cardBg};
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid ${borderColor};
          border-radius: 18px;
          box-shadow: ${isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)"};
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .tc-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.18); }
        .tc-card-active {
          outline: 3px solid var(--mc-accent, #6366f1);
          outline-offset: 3px;
        }
        .tc-select-btn {
          border: none;
          border-radius: 12px;
          padding: 10px 18px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }
        .tc-select-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .tc-swatch { width: 18px; height: 18px; border-radius: 6px; display: inline-block; }
        .tc-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: ${isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)"};
          color: ${isDark ? "#a5b4fc" : "#4f46e5"};
        }
        .tc-section-title { font-weight: 800; font-size: 1.05rem; margin: 0; }
        .tc-section-sub { font-size: 0.82rem; margin: 0; }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "tc-card mb-4 p-3 p-md-4 d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "d-flex align-items-center justify-content-center rounded-3",
						style: {
							width: 52,
							height: 52,
							background: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
							color: "#6366f1",
							fontSize: "1.2rem",
							flexShrink: 0
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faLayerGroup })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-grow-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
							className: "tc-section-title",
							style: { color: textColor },
							children: "Data Table Components"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tc-section-sub mb-0",
							style: { color: mutedColor },
							children: "Select a premium table preset. The chosen design applies globally to every data table across the software."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tc-chip flex-shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faDiceD6,
								style: { fontSize: "0.6rem" }
							}),
							" ",
							TABLE_THEMES.length,
							" Enterprise Presets"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						label: "Sticky gradient headers",
						icon: faLayerGroup
					},
					{
						label: "Smart zebra stripes",
						icon: faCheck
					},
					{
						label: "Accent row hover",
						icon: faPalette
					},
					{
						label: "Status pills + progress",
						icon: faChartLine
					}
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-6 col-xl-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tc-card px-3 py-3 d-flex align-items-center gap-2 h-100",
						style: {
							borderRadius: "14px",
							background: isDark ? "rgba(30,41,59,0.55)" : "rgba(255,255,255,0.7)",
							border: `1px solid ${borderColor}`
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								color: "#6366f1",
								fontSize: "0.9rem",
								flexShrink: 0
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: f.icon })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "small fw-semibold",
							style: { color: textColor },
							children: f.label
						})]
					})
				}, f.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4",
				children: TABLE_THEMES.map((preset) => {
					const active = themeId === preset.id;
					const applying = applyingId === preset.id;
					const isSelected = active && !applying;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-12 col-sm-6 col-xl-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `tc-card p-4 h-100 ${isSelected ? "tc-card-active" : ""}`,
							style: isSelected ? { "--mc-accent": preset.accent } : void 0,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center justify-content-between mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tc-swatch",
											style: { background: `linear-gradient(135deg, ${preset.accent}, ${preset.accent}88)` }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											className: "mb-0 fw-bold",
											style: {
												color: textColor,
												fontSize: "1rem"
											},
											children: preset.name
										})]
									}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tc-chip",
										style: {
											background: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)",
											color: "#10b981"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCheck,
											style: { fontSize: "0.55rem" }
										}), " Active"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3",
									style: {
										color: mutedColor,
										fontSize: "0.8rem",
										minHeight: "2.4rem"
									},
									children: preset.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePreview, { themeId: preset.id }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 d-flex flex-wrap align-items-center justify-content-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "small",
										style: {
											color: mutedColor,
											fontSize: "0.7rem"
										},
										children: preset.tagline
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "tc-select-btn",
										style: {
											background: isSelected ? isDark ? "#065f46" : "#d1fae5" : isDark ? "rgba(99,102,241,0.85)" : "#6366f1",
											color: isSelected ? "#059669" : "#ffffff"
										},
										onClick: () => handleApply(preset.id),
										disabled: applying,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: applying ? faDiceD6 : faPalette,
											style: applying ? { animation: "tc-spin 0.6s linear infinite" } : void 0
										}), applying ? "Applying…" : isSelected ? "Selected" : "Select"]
									})]
								})
							]
						})
					}, preset.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes tc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }` })
		]
	});
};
//#endregion
export { TableComponents as default };
