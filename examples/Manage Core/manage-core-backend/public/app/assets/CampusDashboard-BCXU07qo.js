import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Hl as LineElement, I as faArrowRight, Il as BarElement, Kl as PointElement, Kt as faChalkboardTeacher, Na as faMicrochip, Pl as ArcElement, Pt as faCalendarCheck, Rl as CategoryScale, Ul as LinearScale, Zl as index, bl as useApp, d as useTranslation, eu as plugin_title, f as Bar, gl as faWrench, jc as faUniversity, m as Line, mc as faTools, oi as faFlask, or as faDoorOpen, p as Doughnut, ru as require_react, tu as plugin_tooltip, vl as FontAwesomeIcon, zl as Chart } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Campus/CampusDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, plugin_title, plugin_tooltip, plugin_legend, index);
var CampusDashboard = () => {
	const { theme, setActiveTab } = useApp();
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
					campuses: 3,
					buildings: 25,
					rooms: 320,
					smartClassrooms: 45,
					labs: 60,
					activeBookings: 28,
					maintenanceRequests: 15,
					iotDevices: 1200,
					roomUtilization: [
						65,
						20,
						15
					],
					energyUsage: [
						4500,
						4200,
						4800,
						4100,
						4600,
						4400,
						4700,
						4300,
						4900,
						4500,
						4800,
						5e3
					],
					maintenanceByType: [
						8,
						5,
						12,
						6
					],
					maintLabels: [
						"Electrical",
						"Plumbing",
						"HVAC",
						"Structural"
					],
					recentBookings: [
						{
							id: 1,
							room: "Lab 101",
							purpose: "AI Workshop",
							bookedBy: "Dr. Ali Khan",
							time: "10:00-12:00"
						},
						{
							id: 2,
							room: "Smart Class A",
							purpose: "Guest Lecture",
							bookedBy: "Prof. Sara",
							time: "14:00-16:00"
						},
						{
							id: 3,
							room: "Seminar Hall",
							purpose: "Conference",
							bookedBy: "Admin",
							time: "09:00-17:00"
						},
						{
							id: 4,
							room: "CS Lab 2",
							purpose: "Lab Session",
							bookedBy: "Dr. Usman",
							time: "11:00-13:00"
						}
					]
				});
			} catch (err) {
				setError(err.message || "Failed to load campus dashboard");
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
		purple: "#8b5cf6"
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
	const utilizationData = {
		labels: [
			"In Use",
			"Available",
			"Maintenance"
		],
		datasets: [{
			data: stats.roomUtilization,
			backgroundColor: [
				"#6366f1",
				"#10b981",
				"#f59e0b"
			],
			borderWidth: 0
		}]
	};
	const energyData = {
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
			label: "kWh",
			data: stats.energyUsage,
			borderColor: colors.warning,
			backgroundColor: "rgba(245,158,11,0.1)",
			fill: true,
			tension: .4
		}]
	};
	const maintData = {
		labels: stats.maintLabels,
		datasets: [{
			label: "Requests",
			data: stats.maintenanceByType,
			backgroundColor: [
				"#6366f1",
				"#10b981",
				"#f59e0b",
				"#ef4444"
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap align-items-center justify-content-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 rounded-4",
						style: {
							background: "rgba(99,102,241,0.1)",
							color: colors.primary
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faUniversity,
							size: "xl"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-0",
						style: { color: textColor },
						children: "Campus Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
						children: "Monitor facilities, bookings, and energy usage"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-success rounded-pill px-4 d-flex align-items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalendarCheck }), " Book Room"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), " Report Issue"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						title: "Campuses",
						value: stats.campuses,
						icon: faUniversity,
						color: colors.primary
					},
					{
						title: "Buildings",
						value: stats.buildings,
						icon: faBuilding,
						color: colors.info
					},
					{
						title: "Rooms",
						value: stats.rooms,
						icon: faDoorOpen,
						color: colors.purple
					},
					{
						title: "Smart Classrooms",
						value: stats.smartClassrooms,
						icon: faChalkboardTeacher,
						color: colors.success
					},
					{
						title: "Labs",
						value: stats.labs,
						icon: faFlask,
						color: colors.warning
					},
					{
						title: "Active Bookings",
						value: stats.activeBookings,
						icon: faCalendarCheck,
						color: colors.primary
					},
					{
						title: "Maintenance Req.",
						value: stats.maintenanceRequests,
						icon: faWrench,
						color: colors.danger
					},
					{
						title: "IoT Devices",
						value: stats.iotDevices.toLocaleString(),
						icon: faMicrochip,
						color: colors.info
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
									children: "Room Utilization"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
										data: utilizationData,
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
									children: "Energy Usage (kWh)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										data: energyData,
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
									children: "Maintenance Requests"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										data: maintData,
										options: chartOpts
									})
								})]
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center justify-content-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-0",
									style: { color: textColor },
									children: "Facility Bookings"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm btn-link text-decoration-none",
									style: { color: colors.primary },
									children: ["View Calendar ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowRight,
										size: "xs"
									})]
								})]
							}), stats.recentBookings.map((b, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 mb-3 pb-3",
								style: { borderBottom: `1px solid ${borderColor}` },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "38px",
											height: "38px",
											background: `${colors.info}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCalendarCheck,
											style: {
												color: colors.info,
												fontSize: "14px"
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-grow-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: b.room
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: [
												b.purpose,
												" - ",
												b.bookedBy
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-end flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge rounded-pill bg-primary-subtle text-primary x-small",
											children: b.time
										})
									})
								]
							}, b.id))]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-3",
								style: { color: textColor },
								children: "Quick Actions"
							}), [
								{
									label: "Book Room",
									icon: faCalendarCheck,
									color: colors.primary,
									desc: "Reserve facility"
								},
								{
									label: "Report Issue",
									icon: faTools,
									color: colors.warning,
									desc: "Maintenance request"
								},
								{
									label: "Add Building",
									icon: faBuilding,
									color: colors.success,
									desc: "Register new building"
								},
								{
									label: "IoT Dashboard",
									icon: faMicrochip,
									color: colors.info,
									desc: "Monitor devices"
								}
							].map((act, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn w-100 text-start p-3 mb-2 rounded-3 d-flex align-items-center gap-3 transition",
								style: {
									background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fc",
									border: `1px solid ${borderColor}`
								},
								onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-2px)",
								onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "36px",
											height: "36px",
											background: `${act.color}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: act.icon,
											style: {
												color: act.color,
												fontSize: "14px"
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-grow-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: act.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small text-muted",
											children: act.desc
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowRight,
										className: "text-muted",
										style: {
											fontSize: "11px",
											opacity: .5
										}
									})
								]
							}, idx))]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.x-small { font-size: 11px; } .transition { transition: all 0.25s ease; }` })
		]
	});
};
//#endregion
export { CampusDashboard as default };
