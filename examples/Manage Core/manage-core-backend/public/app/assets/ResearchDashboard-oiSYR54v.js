import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, Bs as faStar, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Fa as faMicroscope, Hl as LineElement, I as faArrowRight, Il as BarElement, Jo as faRocket, Kl as PointElement, Pl as ArcElement, Rl as CategoryScale, Sc as faTrophy, Ul as LinearScale, Zl as index, bl as useApp, d as useTranslation, eu as plugin_title, f as Bar, ft as faBookOpen, ir as faDollarSign, m as Line, oi as faFlask, p as Doughnut, pa as faLightbulb, ru as require_react, tl as faUsers, tu as plugin_tooltip, vl as FontAwesomeIcon, xi as faGlobe, zl as Chart } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Research/ResearchDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, plugin_title, plugin_tooltip, plugin_legend, index);
var ResearchDashboard = () => {
	const { theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [stats, setStats] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	(0, import_react.useEffect)(() => {
		const fetchStats = async () => {
			try {
				await new Promise((r) => setTimeout(r, 600));
				setStats({
					projects: 85,
					grants: 120,
					publications: 340,
					patents: 28,
					researchers: 95,
					conferences: 45,
					activeProjects: 52,
					grantValue: 25e6,
					researchOutput: [
						28,
						32,
						25,
						38,
						42,
						35,
						40,
						48,
						45,
						50,
						55,
						58
					],
					grantDistribution: {
						labels: [
							"Government",
							"Private",
							"International",
							"Internal"
						],
						data: [
							45,
							32,
							28,
							15
						]
					},
					deptResearch: {
						labels: [
							"CS",
							"Engineering",
							"Medicine",
							"Sciences",
							"Business",
							"Arts"
						],
						data: [
							25,
							22,
							18,
							15,
							10,
							8
						]
					},
					recentPublications: [
						{
							id: 1,
							title: "AI in Education",
							authors: "Ali Khan et al.",
							journal: "Nature Education",
							year: 2026
						},
						{
							id: 2,
							title: "Quantum Computing Advances",
							authors: "Sara Ali et al.",
							journal: "Science",
							year: 2026
						},
						{
							id: 3,
							title: "Climate Change Models",
							authors: "Usman Raza et al.",
							journal: "Environmental Research",
							year: 2025
						},
						{
							id: 4,
							title: "Nanotechnology Breakthroughs",
							authors: "Fatima Noor et al.",
							journal: "Nano Letters",
							year: 2026
						},
						{
							id: 5,
							title: "Blockchain Security",
							authors: "Hassan Shah et al.",
							journal: "IEEE Security",
							year: 2025
						}
					]
				});
			} catch (err) {
				setError(err.message || "Failed to load research dashboard");
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []);
	const colors = {
		primary: "#6366f1",
		success: "#10b981",
		warning: "#f59e0b",
		danger: "#ef4444",
		info: "#06b6d4",
		purple: "#8b5cf6",
		pink: "#ec4899"
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-fluid py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "d-flex justify-content-center align-items-center",
			style: { height: "400px" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "spinner-border text-primary",
				role: "status",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "visually-hidden",
					children: "Loading..."
				})
			})
		})
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-fluid py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex flex-column align-items-center justify-content-center",
			style: { height: "400px" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-danger mb-3",
					style: { fontSize: "3rem" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExclamationTriangle })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-2",
					style: { color: textColor },
					children: "Failed to Load Dashboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-3 text-center",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary rounded-pill px-4",
					onClick: () => {
						setLoading(true);
						setError(null);
						setStats(null);
					},
					children: "Retry"
				})
			]
		})
	});
	if (!stats) return null;
	const outputData = {
		labels: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		],
		datasets: [{
			label: "Publications",
			data: stats.researchOutput,
			borderColor: colors.primary,
			backgroundColor: "rgba(99,102,241,0.1)",
			fill: true,
			tension: .4
		}]
	};
	const grantData = {
		labels: stats.grantDistribution.labels,
		datasets: [{
			data: stats.grantDistribution.data,
			backgroundColor: [
				"#6366f1",
				"#10b981",
				"#f59e0b",
				"#06b6d4"
			],
			borderWidth: 0
		}]
	};
	const deptData = {
		labels: stats.deptResearch.labels,
		datasets: [{
			label: "Projects",
			data: stats.deptResearch.data,
			backgroundColor: [
				"#6366f1",
				"#10b981",
				"#f59e0b",
				"#06b6d4",
				"#ec4899",
				"#8b5cf6"
			],
			borderRadius: 6
		}]
	};
	const chartOpts = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
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
		scales: {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 ${isDark ? "text-white" : ""}`,
		style: { minHeight: "100vh" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "d-flex flex-wrap align-items-center justify-content-between mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 rounded-4",
						style: {
							background: "rgba(99,102,241,0.1)",
							color: colors.primary
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faMicroscope,
							size: "xl"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-0",
						style: { color: textColor },
						children: "Research Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
						children: "Monitor research projects, publications, and grants"
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						title: "Projects",
						value: stats.projects,
						icon: faFlask,
						color: colors.primary
					},
					{
						title: "Grants",
						value: stats.grants,
						icon: faDollarSign,
						color: colors.success
					},
					{
						title: "Publications",
						value: stats.publications,
						icon: faBookOpen,
						color: colors.info
					},
					{
						title: "Patents",
						value: stats.patents,
						icon: faLightbulb,
						color: colors.warning
					},
					{
						title: "Researchers",
						value: stats.researchers,
						icon: faUsers,
						color: colors.purple
					},
					{
						title: "Conferences",
						value: stats.conferences,
						icon: faGlobe,
						color: colors.pink
					},
					{
						title: "Active Projects",
						value: stats.activeProjects,
						icon: faRocket,
						color: colors.success
					},
					{
						title: "Grant Value",
						value: `Rs.${(stats.grantValue / 1e7).toFixed(1)}Cr`,
						icon: faTrophy,
						color: colors.primary
					}
				].map((stat, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl col-lg-3 col-md-4 col-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex justify-content-between align-items-start mb-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2 rounded-3",
										style: { backgroundColor: `${stat.color}1a` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: stat.icon,
											style: {
												color: stat.color,
												fontSize: "14px"
											}
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-0",
									style: {
										color: textColor,
										fontSize: "20px"
									},
									children: stat.value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "x-small fw-semibold",
									style: { color: stat.color },
									children: stat.title
								})
							]
						})
					})
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-3",
									style: { color: textColor },
									children: "Research Output"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										data: outputData,
										options: chartOpts
									})
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-3",
									style: { color: textColor },
									children: "Grant Distribution"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
										data: grantData,
										options: {
											responsive: true,
											maintainAspectRatio: false,
											cutout: "65%",
											plugins: { legend: {
												position: "bottom",
												labels: {
													usePointStyle: true,
													boxWidth: 8,
													font: { size: 10 },
													color: mutedColor
												}
											} }
										}
									})
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-3",
									style: { color: textColor },
									children: "Department Research"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										data: deptData,
										options: chartOpts
									})
								})]
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center justify-content-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
							className: "fw-bold mb-0",
							style: { color: textColor },
							children: "Recent Publications"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm btn-link text-decoration-none",
							style: { color: colors.primary },
							children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faArrowRight,
								size: "xs"
							})]
						})]
					}), stats.recentPublications.map((pub, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-3 mb-3 pb-3",
						style: { borderBottom: `1px solid ${borderColor}` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
								style: {
									width: "38px",
									height: "38px",
									background: `${colors.primary}15`
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faStar,
									style: {
										color: colors.primary,
										fontSize: "14px"
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-grow-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-bold",
									style: { color: textColor },
									children: pub.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "x-small",
									style: { color: mutedColor },
									children: [
										pub.authors,
										" - ",
										pub.journal,
										" (",
										pub.year,
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge rounded-pill bg-primary-subtle text-primary x-small",
								children: pub.year
							})
						]
					}, pub.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.x-small { font-size: 11px; }` })
		]
	});
};
//#endregion
export { ResearchDashboard as default };
