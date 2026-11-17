import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ar as faFileAlt, Cn as faClock, Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Er as faEye, Ga as faMoneyBillWave, Kt as faChalkboardTeacher, Mt as faCalendar, Pt as faCalendarCheck, Q as faAward, Uc as faUserGraduate, Vi as faHeartbeat, _r as faEnvelope, al as faVenus, bl as useApp, d as useTranslation, da as faLayerGroup, dc as faTimesCircle, ft as faBookOpen, go as faPhone, ka as faMapMarkerAlt, lr as faDroplet, ru as require_react, sr as faDownload, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { N as getStudentProfile } from "./ems-CSlhEnV6.js";
//#region src/pages/systems/EMS/Students/StudentProfile.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	"Personal Information",
	"Academic Information",
	"Attendance",
	"Results",
	"Fees",
	"Medical",
	"Documents",
	"Timeline"
];
var StudentProfile = () => {
	const { t } = useTranslation();
	const { theme } = useApp();
	const isDark = theme === "dark";
	const [activeTab, setActiveTab] = (0, import_react.useState)("Personal Information");
	const [student, setStudent] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			setStudent(await getStudentProfile() || {});
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const s = student || {};
	const personalInfo = s.personal_info || {
		name: "John Doe",
		student_id: "STU-2026-001",
		date_of_birth: "2005-06-15",
		gender: "Male",
		blood_group: "A+",
		nationality: "American",
		mobile: "+1 (555) 123-4567",
		email: "john.doe@example.com",
		address: "123 Main Street, New York, NY 10001"
	};
	const academicInfo = s.academic_info || {
		institution: "Springfield University",
		program: "Computer Science",
		class: "Class 12",
		semester: "Fall 2026",
		advisor: "Dr. Smith",
		department: "Computer Science",
		campus: "Main Campus"
	};
	const attendance = s.attendance || {
		present: 85,
		absent: 5,
		late: 3,
		total: 93,
		percentage: 91.4,
		records: [
			{
				date: "2026-07-26",
				status: "present",
				course: "Mathematics"
			},
			{
				date: "2026-07-25",
				status: "present",
				course: "Physics"
			},
			{
				date: "2026-07-24",
				status: "late",
				course: "Computer Science"
			},
			{
				date: "2026-07-23",
				status: "absent",
				course: "English"
			},
			{
				date: "2026-07-22",
				status: "present",
				course: "Mathematics"
			}
		]
	};
	const results = s.results || {
		gpa: 3.75,
		cgpa: 3.65,
		exams: [
			{
				name: "Mid Term 2026",
				subject: "Mathematics",
				score: 92,
				grade: "A",
				status: "passed"
			},
			{
				name: "Mid Term 2026",
				subject: "Physics",
				score: 85,
				grade: "B+",
				status: "passed"
			},
			{
				name: "Mid Term 2026",
				subject: "Computer Science",
				score: 95,
				grade: "A+",
				status: "passed"
			},
			{
				name: "Mid Term 2026",
				subject: "English",
				score: 78,
				grade: "B",
				status: "passed"
			}
		]
	};
	const fees = s.fees || {
		total_fees: 15e3,
		paid: 12e3,
		pending: 3e3,
		status: "partial",
		history: [
			{
				date: "2026-01-15",
				amount: 5e3,
				type: "Tuition",
				status: "paid"
			},
			{
				date: "2026-03-10",
				amount: 5e3,
				type: "Tuition",
				status: "paid"
			},
			{
				date: "2026-05-20",
				amount: 2e3,
				type: "Lab Fee",
				status: "paid"
			},
			{
				date: "2026-07-01",
				amount: 3e3,
				type: "Tuition",
				status: "pending"
			}
		]
	};
	const medical = s.medical || {
		blood_group: "A+",
		allergies: "Pollen, Dust",
		medical_conditions: "Asthma",
		emergency_contact: "+1 (555) 987-6543"
	};
	const documents = s.documents || [
		{
			id: 1,
			name: "Birth Certificate",
			type: "PDF",
			uploaded: "2026-01-10",
			size: "2.3 MB"
		},
		{
			id: 2,
			name: "Previous Report Card",
			type: "PDF",
			uploaded: "2026-01-10",
			size: "1.1 MB"
		},
		{
			id: 3,
			name: "Transfer Certificate",
			type: "PDF",
			uploaded: "2026-02-15",
			size: "0.8 MB"
		}
	];
	const timeline = s.timeline || [
		{
			date: "2026-07-26",
			event: "Submitted Mathematics assignment",
			type: "academic"
		},
		{
			date: "2026-07-25",
			event: "Attended Physics lab session",
			type: "attendance"
		},
		{
			date: "2026-07-24",
			event: "Fee payment of $5,000 received",
			type: "fee"
		},
		{
			date: "2026-07-20",
			event: "Medical checkup completed",
			type: "medical"
		},
		{
			date: "2026-07-15",
			event: "Mid-term exam results published",
			type: "result"
		}
	];
	const typeColors = {
		academic: "primary",
		attendance: "success",
		fee: "warning",
		medical: "danger",
		result: "info"
	};
	const typeIcons = {
		academic: faBookOpen,
		attendance: faCalendarCheck,
		fee: faMoneyBillWave,
		medical: faHeartbeat,
		result: faAward
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "skeleton-line w-25 mb-4",
			style: {
				height: "30px",
				borderRadius: "4px"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-lg-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card skeleton-card p-4 border-0 shadow-sm",
					style: {
						height: "400px",
						borderRadius: "18px"
					}
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-lg-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card skeleton-card p-4 border-0 shadow-sm",
					style: {
						height: "400px",
						borderRadius: "18px"
					}
				})
			})]
		})]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `p-4 ${isDark ? "text-white bg-dark" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "alert alert-danger d-flex align-items-center gap-2 rounded-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExclamationTriangle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
		})
	});
	const renderTabContent = () => {
		switch (activeTab) {
			case "Personal Information": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 text-center ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-3",
								style: {
									width: "100px",
									height: "100px",
									fontSize: "36px"
								},
								children: personalInfo.name?.charAt(0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-1",
								children: personalInfo.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: personalInfo.student_id }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `badge rounded-pill bg-success-subtle text-success`,
									children: "Active"
								})
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "fw-bold mb-3",
							children: "Personal Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row g-3",
							children: [
								{
									label: "Date of Birth",
									value: personalInfo.date_of_birth,
									icon: faCalendar
								},
								{
									label: "Gender",
									value: personalInfo.gender,
									icon: faVenus
								},
								{
									label: "Blood Group",
									value: personalInfo.blood_group,
									icon: faDroplet
								},
								{
									label: "Nationality",
									value: personalInfo.nationality,
									icon: faFlag
								},
								{
									label: "Mobile",
									value: personalInfo.mobile,
									icon: faPhone
								},
								{
									label: "Email",
									value: personalInfo.email,
									icon: faEnvelope
								},
								{
									label: "Address",
									value: personalInfo.address,
									icon: faMapMarkerAlt
								}
							].map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3 p-2 rounded-3",
									style: { background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: field.icon,
										className: "text-primary opacity-75"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `x-small fw-bold ${isDark ? "text-light opacity-50" : "text-muted"}`,
										children: field.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "small fw-semibold",
										children: field.value
									})] })]
								})
							}, field.label))
						})]
					})
				})]
			});
			case "Academic Information": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-3",
					children: "Academic Details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row g-3",
					children: [
						{
							label: "Institution",
							value: academicInfo.institution,
							icon: faBuilding
						},
						{
							label: "Campus",
							value: academicInfo.campus,
							icon: faBuilding
						},
						{
							label: "Department",
							value: academicInfo.department,
							icon: faLayerGroup
						},
						{
							label: "Program",
							value: academicInfo.program,
							icon: faBookOpen
						},
						{
							label: "Class",
							value: academicInfo.class,
							icon: faUserGraduate
						},
						{
							label: "Semester",
							value: academicInfo.semester,
							icon: faCalendar
						},
						{
							label: "Advisor",
							value: academicInfo.advisor,
							icon: faChalkboardTeacher
						}
					].map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-3 p-3 rounded-3",
							style: { background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: field.icon,
								className: "text-warning opacity-75"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `x-small fw-bold ${isDark ? "text-light opacity-50" : "text-muted"}`,
								children: field.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small fw-semibold",
								children: field.value
							})] })]
						})
					}, field.label))
				})]
			});
			case "Attendance": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-3",
								children: "Summary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "h1 fw-bold text-primary",
									children: [attendance.percentage, "%"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Overall Attendance"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex justify-content-around",
								children: [
									{
										label: "Present",
										value: attendance.present,
										color: "success"
									},
									{
										label: "Absent",
										value: attendance.absent,
										color: "danger"
									},
									{
										label: "Late",
										value: attendance.late,
										color: "warning"
									}
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h5 fw-bold mb-0 text-${s.color}`,
										children: s.value
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
										children: s.label
									})]
								}, s.label))
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "fw-bold mb-3",
							children: "Recent Records"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-hover align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Course" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: attendance.records.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: r.date
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: r.course
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `badge rounded-pill bg-${r.status === "present" ? "success" : r.status === "late" ? "warning" : "danger"}-subtle text-${r.status === "present" ? "success" : r.status === "late" ? "warning" : "danger"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: r.status === "present" ? faCheckCircle : faTimesCircle,
											className: "me-1"
										}), r.status]
									}) })
								] }, i)) })]
							})
						})]
					})
				})]
			});
			case "Results": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-3",
								children: "Grade Summary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h1 fw-bold text-success",
									children: results.gpa
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Current GPA"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h3 fw-bold text-info",
									children: results.cgpa
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "CGPA"
								})]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "fw-bold mb-3",
							children: "Exam History"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-hover align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Exam" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Subject" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Score" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Grade" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: results.exams.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: e.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small fw-semibold",
										children: e.subject
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: e.score
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge bg-primary-subtle text-primary rounded-pill",
										children: e.grade
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `badge rounded-pill bg-${e.status === "passed" ? "success" : "danger"}-subtle text-${e.status === "passed" ? "success" : "danger"}`,
										children: e.status
									}) })
								] }, i)) })]
							})
						})]
					})
				})]
			});
			case "Fees": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-3",
								children: "Fee Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `h1 fw-bold ${fees.pending > 0 ? "text-danger" : "text-success"}`,
									children: ["$", fees.pending]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `x-small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Pending Amount"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "small",
											children: ["Total: $", fees.total_fees]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "small",
											children: ["Paid: $", fees.paid]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "progress",
										style: {
											height: "8px",
											borderRadius: "10px"
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "progress-bar bg-success",
											style: { width: `${fees.paid / fees.total_fees * 100}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-center mt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge rounded-pill bg-${fees.status === "paid" ? "success" : "warning"}-subtle text-${fees.status === "paid" ? "success" : "warning"}`,
											children: fees.status
										})
									})
								]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
						style: { borderRadius: "18px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "fw-bold mb-3",
							children: "Payment History"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-hover align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Amount" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: fees.history.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: f.date
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small fw-semibold",
										children: f.type
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "small",
										children: ["$", f.amount]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `badge rounded-pill bg-${f.status === "paid" ? "success" : "warning"}-subtle text-${f.status === "paid" ? "success" : "warning"}`,
										children: f.status
									}) })
								] }, i)) })]
							})
						})]
					})
				})]
			});
			case "Medical": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-3",
					children: "Medical Information"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row g-3",
					children: [
						{
							label: "Blood Group",
							value: medical.blood_group,
							icon: faDroplet,
							color: "danger"
						},
						{
							label: "Allergies",
							value: medical.allergies || "None",
							icon: faExclamationTriangle,
							color: "warning"
						},
						{
							label: "Medical Conditions",
							value: medical.medical_conditions || "None",
							icon: faHeartbeat,
							color: "info"
						},
						{
							label: "Emergency Contact",
							value: medical.emergency_contact,
							icon: faPhone,
							color: "success"
						}
					].map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-3 rounded-3 d-flex align-items-center gap-3 ${isDark ? "bg-dark-subtle" : "bg-light"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-3 rounded-3 bg-${field.color}-subtle text-${field.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: field.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `x-small fw-bold ${isDark ? "text-light opacity-50" : "text-muted"}`,
								children: field.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-semibold",
								children: field.value
							})] })]
						})
					}, field.label))
				})]
			});
			case "Documents": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-3",
					children: "Uploaded Documents"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "table table-hover align-middle mb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Size" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Uploaded" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Actions" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "5",
							className: "text-center py-4 text-muted",
							children: "No documents uploaded"
						}) }) : documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "fw-semibold small",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faFileAlt,
									className: "me-2 text-primary"
								}), doc.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-light text-dark rounded-pill",
								children: doc.type
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: doc.size
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: doc.uploaded
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm btn-light border rounded-3 me-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEye })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm btn-light border rounded-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faDownload })
							})] })
						] }, doc.id)) })]
					})
				})]
			});
			case "Timeline": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				style: { borderRadius: "18px" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-3",
					children: "Activity Timeline"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "position-relative",
					style: { paddingLeft: "30px" },
					children: timeline.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center py-4 text-muted",
						children: "No activity recorded"
					}) : timeline.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "position-relative mb-4",
						style: { paddingLeft: "20px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "position-absolute",
							style: {
								left: "-26px",
								top: "4px"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `rounded-circle bg-${typeColors[item.type] || "secondary"}-subtle text-${typeColors[item.type] || "secondary"} d-flex align-items-center justify-content-center`,
								style: {
									width: "32px",
									height: "32px"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: typeIcons[item.type] || faClock,
									size: "xs"
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-3 rounded-3 ${isDark ? "bg-dark-subtle" : "bg-light"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `x-small fw-bold ${isDark ? "text-light opacity-50" : "text-muted"}`,
								children: item.date
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small fw-semibold",
								children: item.event
							})]
						})]
					}, i))
				})]
			});
			default: return null;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-2 ${isDark ? "text-white bg-dark" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "d-flex align-items-center justify-content-between mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Student Profile"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "360-degree student view"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "nav nav-tabs border-0 gap-2 flex-nowrap overflow-auto",
					children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "nav-item",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: `nav-link rounded-3 px-3 py-2 fw-semibold small ${activeTab === tab ? "active bg-primary text-white border-0" : isDark ? "text-light border-0" : "text-muted border-0"}`,
							onClick: () => setActiveTab(tab),
							style: { whiteSpace: "nowrap" },
							children: tab
						})
					}, tab))
				})
			}),
			renderTabContent(),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .x-small { font-size: 11px; }
        .skeleton-card { background-color: ${isDark ? "rgba(255,255,255,0.03)" : "#f3f4f6"}; }
        .skeleton-line { background-color: ${isDark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}; border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        .nav-tabs .nav-link.active { background: #6366f1 !important; color: white !important; }
        .nav-tabs .nav-link { transition: all 0.2s ease; }
        .nav-tabs .nav-link:hover { background: ${isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6"}; }
      ` })
		]
	});
};
//#endregion
export { StudentProfile as default };
