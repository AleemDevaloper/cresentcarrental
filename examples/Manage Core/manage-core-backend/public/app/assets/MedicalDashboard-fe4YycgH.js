import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, $t as faCheckCircle, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, E as faAmbulance, Gc as faUserInjured, Gi as faHospital, Hl as LineElement, I as faArrowRight, Il as BarElement, Kl as PointElement, Pl as ArcElement, Pt as faCalendarCheck, Rl as CategoryScale, Ul as LinearScale, Vi as faHeartbeat, Vs as faStethoscope, Zl as index, bl as useApp, d as useTranslation, eu as plugin_title, f as Bar, m as Line, oi as faFlask, p as Doughnut, qc as faUserMd, ru as require_react, tu as plugin_tooltip, vl as FontAwesomeIcon, xo as faPills, zl as Chart } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Medical/MedicalDashboard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, plugin_title, plugin_tooltip, plugin_legend, index);
var MedicalDashboard = () => {
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
					totalPatients: 4520,
					todayAppointments: 48,
					doctorsOnDuty: 24,
					emergencyCases: 6,
					admissions: 32,
					labTests: 156,
					pharmacyAlerts: 3,
					ambulancesAvailable: 4,
					patientVisits: [
						320,
						380,
						410,
						360,
						390,
						420,
						380,
						450,
						430,
						410,
						440,
						460
					],
					departmentCases: [
						180,
						145,
						120,
						98,
						75,
						110
					],
					deptLabels: [
						"General",
						"Cardiology",
						"Orthopedic",
						"Pediatrics",
						"Dermatology",
						"ENT"
					],
					commonDiagnoses: [
						"Flu/Cold",
						"Hypertension",
						"Diabetes",
						"Allergies",
						"Injury"
					],
					diagnosisCounts: [
						120,
						85,
						65,
						55,
						40
					],
					recentAppointments: [
						{
							id: 1,
							patient: "Ali Ahmed",
							doctor: "Dr. Usman Malik",
							department: "Cardiology",
							time: "10:00 AM",
							status: "In Progress"
						},
						{
							id: 2,
							patient: "Sara Khan",
							doctor: "Dr. Fatima Noor",
							department: "General",
							time: "10:30 AM",
							status: "Waiting"
						},
						{
							id: 3,
							patient: "Usman Ali",
							doctor: "Dr. Hassan Raza",
							department: "Orthopedic",
							time: "11:00 AM",
							status: "Completed"
						},
						{
							id: 4,
							patient: "Fatima Noor",
							doctor: "Dr. Ayesha Malik",
							department: "Pediatrics",
							time: "11:30 AM",
							status: "Cancelled"
						},
						{
							id: 5,
							patient: "Hassan Shah",
							doctor: "Dr. Bilal Ahmed",
							department: "ENT",
							time: "12:00 PM",
							status: "Waiting"
						}
					]
				});
			} catch (err) {
				setError(err.message || "Failed to load medical dashboard");
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
	const visitsData = {
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
			label: "Patient Visits",
			data: stats.patientVisits,
			borderColor: colors.primary,
			backgroundColor: "rgba(99,102,241,0.1)",
			fill: true,
			tension: .4
		}]
	};
	const deptData = {
		labels: stats.deptLabels,
		datasets: [{
			label: "Cases",
			data: stats.departmentCases,
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
	const diagnosesData = {
		labels: stats.commonDiagnoses,
		datasets: [{
			data: stats.diagnosisCounts,
			backgroundColor: [
				"#6366f1",
				"#10b981",
				"#f59e0b",
				"#06b6d4",
				"#ec4899"
			],
			borderWidth: 0,
			hoverOffset: 10
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
							icon: faHeartbeat,
							size: "xl"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-0",
						style: { color: textColor },
						children: "Medical Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
						children: "Monitor healthcare services and patient care"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-danger rounded-pill px-4 d-flex align-items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faAmbulance }), " Emergency"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2",
						onClick: () => setActiveTab?.("medical"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), " New Appointment"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: [
					{
						title: "Total Patients",
						value: stats.totalPatients.toLocaleString(),
						icon: faUserInjured,
						color: colors.primary
					},
					{
						title: "Today's Appointments",
						value: stats.todayAppointments,
						icon: faCalendarCheck,
						color: colors.info
					},
					{
						title: "Doctors On Duty",
						value: stats.doctorsOnDuty,
						icon: faUserMd,
						color: colors.success
					},
					{
						title: "Emergency Cases",
						value: stats.emergencyCases,
						icon: faExclamationTriangle,
						color: colors.danger
					},
					{
						title: "Admissions",
						value: stats.admissions,
						icon: faHospital,
						color: colors.purple
					},
					{
						title: "Lab Tests",
						value: stats.labTests,
						icon: faFlask,
						color: colors.warning
					},
					{
						title: "Pharmacy Alerts",
						value: stats.pharmacyAlerts,
						icon: faPills,
						color: colors.danger
					},
					{
						title: "Ambulances Available",
						value: stats.ambulancesAvailable,
						icon: faAmbulance,
						color: colors.success
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
									children: "Patient Visits"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										data: visitsData,
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
									children: "Department Cases"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										data: deptData,
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
									children: "Common Diagnoses"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: "220px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
										data: diagnosesData,
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
									children: "Today's Appointments"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm btn-link text-decoration-none",
									style: { color: colors.primary },
									children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowRight,
										size: "xs"
									})]
								})]
							}), stats.recentAppointments.map((app, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 mb-3 pb-3",
								style: { borderBottom: `1px solid ${borderColor}` },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
										style: {
											width: "38px",
											height: "38px",
											background: app.status === "In Progress" ? `${colors.info}15` : app.status === "Completed" ? `${colors.success}15` : app.status === "Cancelled" ? `${colors.danger}15` : `${colors.warning}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: app.status === "In Progress" ? faStethoscope : app.status === "Completed" ? faCheckCircle : app.status === "Cancelled" ? faExclamationTriangle : faClock,
											style: {
												color: app.status === "In Progress" ? colors.info : app.status === "Completed" ? colors.success : app.status === "Cancelled" ? colors.danger : colors.warning,
												fontSize: "14px"
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-grow-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "small fw-bold",
											style: { color: textColor },
											children: app.patient
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "x-small",
											style: { color: mutedColor },
											children: [
												app.doctor,
												" - ",
												app.department
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-end flex-shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge rounded-pill x-small fw-semibold ${app.status === "In Progress" ? "bg-info-subtle text-info" : app.status === "Completed" ? "bg-success-subtle text-success" : app.status === "Cancelled" ? "bg-danger-subtle text-danger" : "bg-warning-subtle text-warning"}`,
											children: app.status
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "x-small text-muted mt-1",
											children: app.time
										})]
									})
								]
							}, app.id))]
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
									label: "New Appointment",
									icon: faCalendarCheck,
									color: colors.primary,
									desc: "Schedule appointment"
								},
								{
									label: "Register Patient",
									icon: faUserInjured,
									color: colors.success,
									desc: "New patient registration"
								},
								{
									label: "Emergency",
									icon: faAmbulance,
									color: colors.danger,
									desc: "Emergency case"
								},
								{
									label: "Lab Test",
									icon: faFlask,
									color: colors.info,
									desc: "Order lab test"
								},
								{
									label: "Pharmacy",
									icon: faPills,
									color: colors.warning,
									desc: "Manage pharmacy"
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
export { MedicalDashboard as default };
