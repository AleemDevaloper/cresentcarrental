import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, Cc as faTruck, Ci as faGraduationCap, Dl as require_jsx_runtime, Ga as faMoneyBillWave, Hl as LineElement, Il as BarElement, Jl as RadialLinearScale, Jn as faCrosshairs, Js as faSync, Jt as faChartBar, Kl as PointElement, Pl as ArcElement, Qi as faImage, Rl as CategoryScale, Rr as faFileCsv, Uc as faUserGraduate, Ul as LinearScale, Un as faCompress, Xt as faChartPie, Yt as faChartLine, Zl as index, bl as useApp, d as useTranslation, eu as plugin_title, f as Bar, g as Radar, h as Pie, m as Line, p as Doughnut, qr as faFilePdf, qt as faChartArea, ru as require_react, sr as faDownload, tu as plugin_tooltip, ut as faBook, vl as FontAwesomeIcon, wr as faExpand, zl as Chart, zr as faFileExcel } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/EmsAnalytics.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, plugin_title, plugin_tooltip, plugin_legend, index);
var CHART_TYPES = [
	{
		key: "line",
		label: "Line",
		icon: faChartLine
	},
	{
		key: "bar",
		label: "Bar",
		icon: faChartBar
	},
	{
		key: "pie",
		label: "Pie",
		icon: faChartPie
	},
	{
		key: "doughnut",
		label: "Doughnut",
		icon: faChartArea
	},
	{
		key: "radar",
		label: "Radar",
		icon: faCrosshairs
	}
];
var ANALYTICS_CARDS = [
	{
		id: "attendance",
		label: "Attendance Rate",
		value: "89.9%",
		icon: faUserGraduate,
		color: "#6366f1",
		trend: "+2.1%",
		data: [
			82,
			85,
			87,
			86,
			89,
			90,
			89.9
		]
	},
	{
		id: "academic",
		label: "Academic Performance",
		value: "3.4 GPA",
		icon: faGraduationCap,
		color: "#10b981",
		trend: "+0.2",
		data: [
			3.1,
			3.2,
			3.3,
			3.2,
			3.4,
			3.3,
			3.4
		]
	},
	{
		id: "fee",
		label: "Fee Collection",
		value: "85%",
		icon: faMoneyBillWave,
		color: "#f59e0b",
		trend: "+5%",
		data: [
			72,
			75,
			78,
			80,
			82,
			84,
			85
		]
	},
	{
		id: "library",
		label: "Library Usage",
		value: "3,200",
		icon: faBook,
		color: "#06b6d4",
		trend: "+12%",
		data: [
			2200,
			2400,
			2600,
			2800,
			3e3,
			3100,
			3200
		]
	},
	{
		id: "transport",
		label: "Transport Usage",
		value: "1,200",
		icon: faTruck,
		color: "#8b5cf6",
		trend: "+8%",
		data: [
			850,
			920,
			980,
			1050,
			1100,
			1150,
			1200
		]
	}
];
var EmsAnalytics = () => {
	const { theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [chartType, setChartType] = (0, import_react.useState)("line");
	const [selectedMetric, setSelectedMetric] = (0, import_react.useState)("attendance");
	const [dateRange, setDateRange] = (0, import_react.useState)("This Year");
	const [fullscreen, setFullscreen] = (0, import_react.useState)(false);
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	const card = ANALYTICS_CARDS.find((c) => c.id === selectedMetric) || ANALYTICS_CARDS[0];
	const chartData = {
		labels: [
			"Week 1",
			"Week 2",
			"Week 3",
			"Week 4",
			"Week 5",
			"Week 6",
			"Week 7"
		],
		datasets: [{
			label: card.label,
			data: card.data,
			borderColor: card.color,
			backgroundColor: chartType === "line" ? `${card.color}20` : chartType === "bar" ? card.color : [
				card.color,
				"#10b981",
				"#f59e0b",
				"#06b6d4",
				"#8b5cf6",
				"#ec4899",
				"#ef4444"
			],
			fill: chartType === "line",
			tension: .4,
			pointBackgroundColor: card.color,
			pointBorderColor: "#fff",
			pointBorderWidth: 2
		}]
	};
	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					color: mutedColor,
					font: { size: 10 }
				}
			},
			tooltip: {
				backgroundColor: isDark ? "#1e293b" : "#fff",
				titleColor: textColor,
				bodyColor: mutedColor,
				borderColor,
				borderWidth: 1,
				cornerRadius: 10,
				padding: 10
			}
		},
		scales: chartType === "pie" || chartType === "doughnut" ? void 0 : {
			y: {
				beginAtZero: true,
				grid: { color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" },
				ticks: {
					color: mutedColor,
					font: { size: 10 }
				}
			},
			x: {
				grid: { display: false },
				ticks: {
					color: mutedColor,
					font: { size: 10 }
				}
			}
		}
	};
	const renderChart = () => {
		const commonProps = {
			data: chartData,
			options: chartOptions
		};
		switch (chartType) {
			case "line": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { ...commonProps });
			case "bar": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, { ...commonProps });
			case "pie": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, { ...commonProps });
			case "doughnut": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, { ...commonProps });
			case "radar": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, { ...commonProps });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { ...commonProps });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "text-white" : ""}`,
		style: {
			background: isDark ? "linear-gradient(135deg, #060816 0%, #111827 45%, #111c2f 100%)" : "linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #eef2ff 100%)",
			minHeight: "100vh"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `rounded-4 p-4 mb-4 border-0 shadow-sm ${isDark ? "bg-dark border border-secondary" : "bg-white"}`,
				style: {
					background: isDark ? "rgba(17,24,39,0.95)" : "rgba(255,255,255,0.9)",
					border: `1px solid ${borderColor}`,
					boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap align-items-center justify-content-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-1",
						children: "EMS Analytics"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
						children: "Institutional performance metrics and insights"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "dropdown",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `btn rounded-3 dropdown-toggle d-flex align-items-center gap-2 ${isDark ? "btn-outline-light" : "btn-outline-secondary"}`,
								"data-bs-toggle": "dropdown",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faDownload }), " Export"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "dropdown-menu rounded-3 shadow-sm border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item small",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faFilePdf,
											className: "me-2 text-danger"
										}), "PDF"]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item small",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faFileExcel,
											className: "me-2 text-success"
										}), "Excel"]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item small",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faFileCsv,
											className: "me-2 text-primary"
										}), "CSV"]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item small",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faImage,
											className: "me-2 text-info"
										}), "Image"]
									}) })
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: `btn rounded-3 ${isDark ? "btn-outline-light" : "btn-outline-secondary"}`,
							onClick: () => setFullscreen(!fullscreen),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: fullscreen ? faCompress : faExpand })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Date Range"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: dateRange,
								onChange: (e) => setDateRange(e.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "This Week" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "This Month" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "This Quarter" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "This Year" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Custom" })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "small fw-bold text-muted mb-2",
								children: "Chart Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex gap-1",
								children: CHART_TYPES.map((ct) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `btn btn-sm rounded-3 ${chartType === ct.key ? "btn-primary" : isDark ? "btn-outline-light" : "btn-outline-secondary"}`,
									onClick: () => setChartType(ct.key),
									title: ct.label,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: ct.icon })
								}, ct.key))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3 d-flex align-items-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-outline-primary rounded-3 w-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faSync,
									className: "me-2"
								}), "Refresh Data"]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: ANALYTICS_CARDS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md",
					style: { minWidth: "180px" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"} ${selectedMetric === c.id ? "ring-2 ring-primary" : ""}`,
						style: {
							cursor: "pointer",
							outline: selectedMetric === c.id ? `2px solid ${c.color}` : "none",
							boxShadow: "0 14px 36px rgba(15, 23, 42, 0.08)"
						},
						onClick: () => setSelectedMetric(c.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2 mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2 rounded-3",
										style: { backgroundColor: `${c.color}15` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: c.icon,
											style: {
												color: c.color,
												fontSize: "14px"
											}
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge rounded-pill bg-success-subtle text-success ms-auto x-small",
										children: c.trend
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-0",
									style: {
										color: textColor,
										fontSize: "18px"
									},
									children: c.value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "x-small fw-semibold",
									style: { color: mutedColor },
									children: c.label
								})
							]
						})
					})
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { boxShadow: "0 18px 44px rgba(15, 23, 42, 0.10)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `card-body p-4 ${fullscreen ? "vh-100 d-flex flex-column justify-content-center" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center justify-content-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
							className: "fw-bold mb-0",
							style: { color: textColor },
							children: [
								card.label,
								" - ",
								chartType.charAt(0).toUpperCase() + chartType.slice(1),
								" Chart"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
							children: dateRange
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { height: fullscreen ? "70vh" : "350px" },
						children: renderChart()
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.x-small { font-size: 11px; }` })
		]
	});
};
//#endregion
export { EmsAnalytics as default };
