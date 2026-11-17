import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, Cr as faExclamationTriangle, Cs as faSignOutAlt, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Hl as LineElement, I as faArrowRight, Il as BarElement, Kl as PointElement, Pl as ArcElement, Rl as CategoryScale, Sn as faClipboardList, Ss as faSignInAlt, Uc as faUserGraduate, Ul as LinearScale, Zl as index, aa as faKey, at as faBed, bl as useApp, d as useTranslation, eu as plugin_title, f as Bar, gl as faWrench, m as Line, or as faDoorOpen, p as Doughnut, ru as require_react, tl as faUsers, tu as plugin_tooltip, vl as FontAwesomeIcon, zl as Chart } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Hostel/HostelDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, plugin_title, plugin_tooltip, plugin_legend, index);
var HostelDashboard = () => {
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
					totalHostels: 6,
					totalRooms: 240,
					totalBeds: 720,
					occupied: 580,
					available: 140,
					studentsLiving: 560,
					staff: 48,
					todayCheckIns: 12,
					todayCheckOuts: 8,
					pendingMaintenance: 15,
					occupancyRate: 80.5,
					roomTypes: {
						labels: [
							"Single",
							"Double",
							"Triple",
							"Dormitory"
						],
						data: [
							40,
							80,
							60,
							60
						]
					},
					monthlyCheckins: [
						45,
						52,
						38,
						65,
						48,
						55,
						42,
						58,
						62,
						50,
						44,
						55
					],
					recentActivities: [
						{
							id: 1,
							action: "Room Allocated",
							student: "Ali Ahmed",
							room: "H1-201",
							time: "10 min ago"
						},
						{
							id: 2,
							action: "Check-Out",
							student: "Sara Khan",
							room: "H2-105",
							time: "30 min ago"
						},
						{
							id: 3,
							action: "Maintenance Request",
							student: "Block A",
							room: "Room 301",
							time: "1 hour ago"
						},
						{
							id: 4,
							action: "New Allotment",
							student: "Usman Ali",
							room: "H3-401",
							time: "2 hours ago"
						},
						{
							id: 5,
							action: "Visitor Entry",
							student: "Fatima Noor",
							room: "H1-202",
							time: "3 hours ago"
						}
					]
				});
			} catch (err) {
				setError(err.message || "Failed to load hostel dashboard");
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
	const occupancyData = {
		labels: ["Occupied", "Available"],
		datasets: [{
			data: [stats.occupied, stats.available],
			backgroundColor: ["#6366f1", "#10b981"],
			borderWidth: 0,
			hoverOffset: 10
		}]
	};
	const roomTypeData = {
		labels: stats.roomTypes.labels,
		datasets: [{
			label: "Rooms",
			data: stats.roomTypes.data,
			backgroundColor: [
				"#6366f1",
				"#10b981",
				"#f59e0b",
				"#ec4899"
			],
			borderRadius: 6
		}]
	};
	const checkinData = {
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
			label: "Check-Ins",
			data: stats.monthlyCheckins,
			borderColor: colors.primary,
			backgroundColor: "rgba(99,102,241,0.1)",
			fill: true,
			tension: .4
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
							icon: faBuilding,
							size: "xl"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-0",
						style: { color: textColor },
						children: "Hostel Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
						children: "Monitor hostels, rooms, and allocations"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-success rounded-pill px-4 d-flex align-items-center gap-2",
						onClick: () => setActiveTab?.("hostel"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faKey }), " Allocate Room"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2",
						onClick: () => setActiveTab?.("hostel"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), " Add Hostel"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						title: "Total Hostels",
						value: stats.totalHostels,
						icon: faBuilding,
						color: colors.primary
					},
					{
						title: "Total Rooms",
						value: stats.totalRooms,
						icon: faDoorOpen,
						color: colors.info
					},
					{
						title: "Total Beds",
						value: stats.totalBeds,
						icon: faBed,
						color: colors.purple
					},
					{
						title: "Occupied",
						value: stats.occupied,
						icon: faUserGraduate,
						color: colors.primary
					},
					{
						title: "Available",
						value: stats.available,
						icon: faBed,
						color: colors.success
					},
					{
						title: "Students Living",
						value: stats.studentsLiving,
						icon: faUsers,
						color: colors.warning
					},
					{
						title: "Staff",
						value: stats.staff,
						icon: faClipboardList,
						color: colors.pink
					},
					{
						title: "Today's Check-Ins",
						value: stats.todayCheckIns,
						icon: faSignInAlt,
						color: colors.success
					},
					{
						title: "Today's Check-Outs",
						value: stats.todayCheckOuts,
						icon: faSignOutAlt,
						color: colors.danger
					},
					{
						title: "Pending Maintenance",
						value: stats.pendingMaintenance,
						icon: faWrench,
						color: colors.warning
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
									className: "fw-bold mb-3",
									style: { color: textColor },
									children: [
										"Occupancy Rate (",
										stats.occupancyRate,
										"%)"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
										data: occupancyData,
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
									children: "Room Types"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										data: roomTypeData,
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
									children: "Monthly Check-Ins"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										data: checkinData,
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
									children: "Recent Activities"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm btn-link text-decoration-none",
									style: { color: colors.primary },
									children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowRight,
										size: "xs"
									})]
								})]
							}), stats.recentActivities.map((act, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
											icon: faClipboardList,
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
											children: act.action
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: [
												act.student,
												" - ",
												act.room
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-end flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small text-muted",
											children: act.time
										})
									})
								]
							}, act.id))]
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
									label: "Allocate Room",
									icon: faKey,
									color: colors.primary,
									desc: "Assign room to student"
								},
								{
									label: "Check-In Student",
									icon: faSignInAlt,
									color: colors.success,
									desc: "Process check-in"
								},
								{
									label: "Check-Out",
									icon: faSignOutAlt,
									color: colors.danger,
									desc: "Process check-out"
								},
								{
									label: "Maintenance Request",
									icon: faWrench,
									color: colors.warning,
									desc: "Report issue"
								},
								{
									label: "Add Hostel",
									icon: faPlus,
									color: colors.purple,
									desc: "Register new hostel"
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
export { HostelDashboard as default };
