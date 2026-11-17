import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Cn as faClock, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, Ga as faMoneyBillWave, I as faArrowRight, bl as useApp, d as useTranslation, dc as faTimesCircle, f as Bar, ft as faBookOpen, m as Line, p as Doughnut, pt as faBookmark, ru as require_react, tl as faUsers, ut as faBook, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Library/LibraryDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var LibraryDashboard = () => {
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
					totalBooks: 12500,
					available: 8200,
					issued: 3500,
					reserved: 400,
					overdue: 280,
					lost: 120,
					digitalBooks: 2400,
					members: 5600,
					activeReaders: 3200,
					fineCollected: 45800,
					bookCategories: [
						{
							name: "Science",
							count: 2800
						},
						{
							name: "Literature",
							count: 2200
						},
						{
							name: "Technology",
							count: 1900
						},
						{
							name: "History",
							count: 1500
						},
						{
							name: "Arts",
							count: 1200
						},
						{
							name: "Mathematics",
							count: 1100
						},
						{
							name: "Philosophy",
							count: 800
						},
						{
							name: "Other",
							count: 1e3
						}
					],
					monthlyCirculation: [
						420,
						560,
						480,
						620,
						580,
						490,
						530,
						680,
						590,
						510,
						640,
						720
					],
					mostBorrowed: [
						{
							name: "Introduction to AI",
							count: 145
						},
						{
							name: "Calculus Made Easy",
							count: 128
						},
						{
							name: "The Great Gatsby",
							count: 112
						},
						{
							name: "Clean Code",
							count: 98
						},
						{
							name: "Atomic Habits",
							count: 85
						}
					],
					recentTransactions: [
						{
							id: 1,
							member: "Ali Ahmed",
							book: "Introduction to AI",
							type: "Issued",
							date: "5 min ago"
						},
						{
							id: 2,
							member: "Sara Khan",
							book: "Calculus Made Easy",
							type: "Returned",
							date: "15 min ago"
						},
						{
							id: 3,
							member: "Usman Ali",
							book: "The Great Gatsby",
							type: "Issued",
							date: "30 min ago"
						},
						{
							id: 4,
							member: "Fatima Noor",
							book: "Clean Code",
							type: "Overdue",
							date: "1 hour ago"
						},
						{
							id: 5,
							member: "Hassan Raza",
							book: "Atomic Habits",
							type: "Returned",
							date: "2 hours ago"
						}
					]
				});
			} catch (err) {
				setError(err.message || "Failed to load library dashboard");
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
	const categoryData = {
		labels: stats.bookCategories.map((c) => c.name),
		datasets: [{
			data: stats.bookCategories.map((c) => c.count),
			backgroundColor: [
				"#6366f1",
				"#10b981",
				"#f59e0b",
				"#06b6d4",
				"#ec4899",
				"#8b5cf6",
				"#f97316",
				"#94a3b8"
			],
			borderWidth: 0,
			hoverOffset: 10
		}]
	};
	const circulationData = {
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
			label: "Books Circulated",
			data: stats.monthlyCirculation,
			borderColor: colors.primary,
			backgroundColor: "rgba(99, 102, 241, 0.1)",
			fill: true,
			tension: .4
		}]
	};
	const borrowedData = {
		labels: stats.mostBorrowed.map((b) => b.name),
		datasets: [{
			label: "Times Borrowed",
			data: stats.mostBorrowed.map((b) => b.count),
			backgroundColor: [
				"#6366f1",
				"#10b981",
				"#f59e0b",
				"#06b6d4",
				"#ec4899"
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
							icon: faBook,
							size: "xl"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-0",
						style: { color: textColor },
						children: "Library Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
						children: "Track books, members, and circulation"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-success rounded-pill px-4 d-flex align-items-center gap-2",
						onClick: () => setActiveTab?.("library"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), " Issue Book"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2",
						onClick: () => setActiveTab?.("library"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), " Add Book"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						title: "Total Books",
						value: stats.totalBooks.toLocaleString(),
						icon: faBook,
						color: colors.primary
					},
					{
						title: "Available",
						value: stats.available.toLocaleString(),
						icon: faCheckCircle,
						color: colors.success
					},
					{
						title: "Issued",
						value: stats.issued.toLocaleString(),
						icon: faBookmark,
						color: colors.info
					},
					{
						title: "Reserved",
						value: stats.reserved,
						icon: faClock,
						color: colors.warning
					},
					{
						title: "Overdue",
						value: stats.overdue,
						icon: faExclamationTriangle,
						color: colors.danger
					},
					{
						title: "Lost",
						value: stats.lost,
						icon: faTimesCircle,
						color: colors.danger
					},
					{
						title: "Digital Books",
						value: stats.digitalBooks.toLocaleString(),
						icon: faBookOpen,
						color: colors.purple
					},
					{
						title: "Members",
						value: stats.members.toLocaleString(),
						icon: faUsers,
						color: colors.primary
					},
					{
						title: "Active Readers",
						value: stats.activeReaders.toLocaleString(),
						icon: faEye,
						color: colors.success
					},
					{
						title: "Fine Collected",
						value: `Rs.${(stats.fineCollected / 1e3).toFixed(1)}K`,
						icon: faMoneyBillWave,
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-3",
									style: { color: textColor },
									children: "Book Categories"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
										data: categoryData,
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
									children: "Monthly Circulation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										data: circulationData,
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
									children: "Most Borrowed"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										data: borrowedData,
										options: {
											...chartOpts,
											indexAxis: "y",
											scales: {
												...chartOpts.scales,
												x: {
													...chartOpts.scales.y,
													beginAtZero: true
												},
												y: { ...chartOpts.scales.x }
											}
										}
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
									children: "Recent Transactions"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm btn-link text-decoration-none",
									style: { color: colors.primary },
									children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowRight,
										size: "xs"
									})]
								})]
							}), stats.recentTransactions.map((txn, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 mb-3 pb-3",
								style: { borderBottom: `1px solid ${borderColor}` },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "38px",
											height: "38px",
											background: txn.type === "Returned" ? `${colors.success}15` : txn.type === "Overdue" ? `${colors.danger}15` : `${colors.info}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: txn.type === "Returned" ? faCheckCircle : txn.type === "Overdue" ? faExclamationTriangle : faBookmark,
											style: {
												color: txn.type === "Returned" ? colors.success : txn.type === "Overdue" ? colors.danger : colors.info,
												fontSize: "14px"
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-grow-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: txn.member
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: txn.book
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-end flex-shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge rounded-pill x-small fw-semibold ${txn.type === "Returned" ? "bg-success-subtle text-success" : txn.type === "Overdue" ? "bg-danger-subtle text-danger" : "bg-info-subtle text-info"}`,
											children: txn.type
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small text-muted mt-1",
											children: txn.date
										})]
									})
								]
							}, txn.id))]
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
									label: "Issue Book",
									icon: faBookmark,
									color: colors.success,
									desc: "Issue to member"
								},
								{
									label: "Return Book",
									icon: faCheckCircle,
									color: colors.info,
									desc: "Process return"
								},
								{
									label: "Add New Book",
									icon: faPlus,
									color: colors.primary,
									desc: "Catalog a book"
								},
								{
									label: "Add Member",
									icon: faUsers,
									color: colors.purple,
									desc: "Register member"
								},
								{
									label: "Collect Fine",
									icon: faMoneyBillWave,
									color: colors.warning,
									desc: "Overdue fines"
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
export { LibraryDashboard as default };
