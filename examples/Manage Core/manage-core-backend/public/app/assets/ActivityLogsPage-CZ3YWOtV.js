import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Bs as faStar, Cn as faClock, Dl as require_jsx_runtime, Ki as faHourglassHalf, Lc as faUser, Lo as faReceipt, Mt as faCalendar, Rt as faCalendarXmark, Ss as faSignInAlt, Tt as faBuildingColumns, Ui as faHistory, Vn as faCommentDots, Yt as faChartLine, bl as useApp, ea as faInbox, gs as faShieldHalved, in as faChevronRight, os as faSearch, ot as faBell, ru as require_react, sr as faDownload, ti as faFilter, tl as faUsers, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/workforce/activity-logs/activityLogsData.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var ACTIVITY_TYPE_CONFIG = {
	checked_in: {
		color: "primary",
		icon: faSignInAlt,
		label: "Checked In",
		category: "attendance"
	},
	leave_request: {
		color: "warning",
		icon: faCalendarXmark,
		label: "Leave Request Submitted",
		category: "leave"
	},
	feedback_received: {
		color: "success",
		icon: faCommentDots,
		label: "Feedback Received",
		category: "performance"
	},
	performance_review: {
		color: "info",
		icon: faStar,
		label: "Performance Review Submitted",
		category: "performance"
	},
	bank_details: {
		color: "danger",
		icon: faBuildingColumns,
		label: "Bank Details Updated",
		category: "payroll"
	},
	team_change: {
		color: "primary",
		icon: faUsers,
		label: "Team Change Notified",
		category: "organization"
	},
	reimbursement: {
		color: "secondary",
		icon: faReceipt,
		label: "Reimbursement Approved",
		category: "finance"
	}
};
var ACTIVITY_CATEGORIES = [
	{
		id: "all",
		label: "All Categories"
	},
	{
		id: "attendance",
		label: "Attendance"
	},
	{
		id: "leave",
		label: "Leave"
	},
	{
		id: "performance",
		label: "Performance"
	},
	{
		id: "payroll",
		label: "Payroll"
	},
	{
		id: "organization",
		label: "Organization"
	},
	{
		id: "finance",
		label: "Finance"
	}
];
var SAMPLE_ACTIVITIES = [
	{
		id: 1,
		type: "checked_in",
		title: "Checked In",
		description: "You successfully checked in today using the mobile app's biometric system.",
		timestamp: "2025-08-07T09:07:00",
		dateGroup: "Today",
		status: "completed",
		employee: {
			id: 1,
			name: "You",
			role: "Employee"
		},
		isNew: true
	},
	{
		id: 2,
		type: "leave_request",
		title: "Leave Request Submitted",
		description: "Casual Leave for Aug 9, 2025 — pending manager approval.",
		timestamp: "2025-08-07T15:14:00",
		dateGroup: "Today",
		status: "pending",
		employee: {
			id: 1,
			name: "You",
			role: "Employee"
		},
		isNew: false
	},
	{
		id: 3,
		type: "feedback_received",
		title: "Feedback Received",
		description: "Your team lead added feedback to your monthly check-in.",
		timestamp: "2025-08-06T18:55:00",
		dateGroup: "Yesterday",
		status: "completed",
		employee: {
			id: 2,
			name: "Sarah Chen",
			role: "Team Lead"
		},
		isNew: false
	},
	{
		id: 4,
		type: "performance_review",
		title: "Performance Review Submitted",
		description: "Q2 performance review has been submitted for HR review.",
		timestamp: "2025-08-06T17:25:00",
		dateGroup: "Yesterday",
		status: "in_review",
		employee: {
			id: 1,
			name: "You",
			role: "Employee"
		},
		isNew: false
	},
	{
		id: 5,
		type: "bank_details",
		title: "Bank Details Updated",
		description: "Your bank account information was updated successfully.",
		timestamp: "2025-08-06T16:23:00",
		dateGroup: "Yesterday",
		status: "completed",
		employee: {
			id: 1,
			name: "You",
			role: "Employee"
		},
		isNew: false
	},
	{
		id: 6,
		type: "team_change",
		title: "Team Change Notified",
		description: "You have been reassigned to the Product Engineering team.",
		timestamp: "2025-08-03T16:23:00",
		dateGroup: "Aug 3, 2025",
		status: "completed",
		employee: {
			id: 3,
			name: "HR Admin",
			role: "HR Manager"
		},
		isNew: false
	},
	{
		id: 7,
		type: "feedback_received",
		title: "Feedback Received",
		description: "Peer feedback received from your sprint retrospective session.",
		timestamp: "2025-08-03T18:28:00",
		dateGroup: "Aug 3, 2025",
		status: "completed",
		employee: {
			id: 4,
			name: "Alex Rivera",
			role: "Peer"
		},
		isNew: false
	},
	{
		id: 8,
		type: "reimbursement",
		title: "Reimbursement Approved",
		description: "Your travel expense reimbursement was approved.",
		timestamp: "2025-08-03T16:50:00",
		dateGroup: "Aug 3, 2025",
		status: "approved",
		employee: {
			id: 5,
			name: "Finance Team",
			role: "Finance"
		},
		isNew: false
	}
];
var EXTRA_ACTIVITIES = [{
	id: 9,
	type: "checked_in",
	title: "Checked In",
	description: "Checked in via web portal at office location.",
	timestamp: "2025-08-02T08:45:00",
	dateGroup: "Aug 2, 2025",
	status: "completed",
	employee: {
		id: 1,
		name: "You",
		role: "Employee"
	},
	isNew: false
}, {
	id: 10,
	type: "leave_request",
	title: "Leave Request Submitted",
	description: "Sick leave for Aug 1, 2025 — approved by manager.",
	timestamp: "2025-08-01T10:30:00",
	dateGroup: "Aug 1, 2025",
	status: "approved",
	employee: {
		id: 1,
		name: "You",
		role: "Employee"
	},
	isNew: false
}];
var STATUS_CONFIG = {
	completed: {
		label: "Completed",
		badge: "success"
	},
	pending: {
		label: "Pending",
		badge: "warning"
	},
	in_review: {
		label: "In Review",
		badge: "info"
	},
	approved: {
		label: "Approved",
		badge: "primary"
	}
};
var formatActivityDateTime = (timestamp) => {
	return new Date(timestamp).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	}).replace(",", " at");
};
var groupActivitiesByDate = (activities) => {
	const groups = {};
	activities.forEach((activity) => {
		const key = activity.dateGroup;
		if (!groups[key]) groups[key] = [];
		groups[key].push(activity);
	});
	return Object.entries(groups).map(([date, items]) => ({
		date,
		items
	}));
};
//#endregion
//#region src/pages/workforce/activity-logs/ActivityItem.jsx
var import_jsx_runtime = require_jsx_runtime();
var CATEGORY_LABELS = {
	attendance: "Attendance",
	leave: "Leave",
	performance: "Performance",
	payroll: "Payroll",
	organization: "Organization",
	finance: "Finance"
};
var ActivityItem = ({ activity, onEmployeeClick }) => {
	const config = ACTIVITY_TYPE_CONFIG[activity.type] || ACTIVITY_TYPE_CONFIG.checked_in;
	const statusConfig = STATUS_CONFIG[activity.status] || STATUS_CONFIG.completed;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "timeline-item mb-4 position-relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `timeline-icon position-absolute start-0 translate-middle-x rounded-circle bg-${config.color} d-flex align-items-center justify-content-center shadow-sm`,
			style: {
				width: "22px",
				height: "22px",
				marginTop: "12px",
				zIndex: 2
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: config.icon,
				style: {
					fontSize: "9px",
					color: "#fff"
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "timeline-content ms-4 p-4 rounded-4 border border-light transition hover-lift-sm bg-white shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between align-items-start mb-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-2 flex-wrap mb-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "fw-bold text-dark",
								children: activity.title
							}),
							activity.isNew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-danger-subtle text-danger x-small fw-bold text-uppercase",
								children: "New"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `badge bg-${config.color}-subtle text-${config.color} x-small fw-bold text-uppercase`,
								children: CATEGORY_LABELS[config.category] || config.category
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "x-small text-muted fw-bold text-uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faClock,
							className: "me-1"
						}), formatActivityDateTime(activity.timestamp)]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `badge bg-${statusConfig.badge}-subtle text-${statusConfig.badge} text-uppercase flex-shrink-0`,
						style: { fontSize: "10px" },
						children: statusConfig.label
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted small mb-3 opacity-75",
					children: activity.description
				}),
				activity.employee && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn btn-light btn-sm d-flex align-items-center gap-2 border-0 shadow-sm",
					onClick: () => onEmployeeClick?.(activity.employee),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "avatar rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0",
							style: {
								width: 28,
								height: 28
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faUser,
								className: "text-muted small"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small fw-bold",
								children: activity.employee.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "extra-small text-muted",
								children: activity.employee.role
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faChevronRight,
							className: "text-muted ms-auto extra-small"
						})
					]
				})
			]
		})]
	});
};
//#endregion
//#region src/pages/workforce/activity-logs/DateGroup.jsx
var DateGroup = ({ date, items, onEmployeeClick }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "mb-4",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex align-items-center gap-3 mb-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "badge bg-light text-dark border px-3 py-2 fw-semibold",
				children: date
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-grow-1 border-bottom border-light" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted x-small fw-bold text-uppercase",
				children: [items.length, " events"]
			})
		]
	}), items.map((activity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityItem, {
		activity,
		onEmployeeClick
	}, activity.id))]
});
//#endregion
//#region src/pages/workforce/activity-logs/LoadMoreButton.jsx
var LoadMoreButton = ({ onClick, loading, hasMore, remaining = 0 }) => {
	if (!hasMore) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-muted small d-inline-flex align-items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: faCheckCircle,
				className: "text-success"
			}), "You've reached the end of the activity feed"]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm transition",
			onClick,
			disabled: loading,
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "spinner-border spinner-border-sm me-2",
				role: "status",
				"aria-hidden": "true"
			}), "Loading..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Load More", remaining > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "ms-2 opacity-75",
				children: [
					"(",
					remaining,
					" remaining)"
				]
			})] })
		})
	});
};
//#endregion
//#region src/pages/workforce/activity-logs/ActivityTimeline.jsx
var ActivityTimeline = ({ activities, onLoadMore, loading, hasMore, onEmployeeClick, totalCount }) => {
	const grouped = groupActivitiesByDate(activities);
	if (activities.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center py-5 text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: faInbox,
				className: "fs-2 mb-3 d-block opacity-50"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
				className: "fw-bold text-dark",
				children: "No activities found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "small mb-0",
				children: "Try adjusting your search or filter criteria."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "activity-timeline position-relative ps-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "timeline-line position-absolute top-0 bottom-0 start-0 bg-light",
				style: {
					width: "2px",
					marginLeft: "10px"
				}
			}),
			totalCount != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted small mb-4",
				children: [
					"Showing ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activities.length }),
					" of ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: totalCount }),
					" activities"
				]
			}),
			grouped.map(({ date, items }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateGroup, {
				date,
				items,
				onEmployeeClick
			}, date)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadMoreButton, {
				onClick: onLoadMore,
				loading,
				hasMore,
				remaining: totalCount != null ? totalCount - activities.length : 0
			})
		]
	});
};
//#endregion
//#region src/pages/workforce/activity-logs/ActivityLogsPage.jsx
var PAGE_SIZE = 5;
var StatCard = ({ title, value, icon, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "col-md-3 col-6",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "card border-0 shadow-sm h-100",
		style: { borderRadius: "15px" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-body d-flex align-items-center gap-3 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 bg-${color}-subtle text-${color}`,
				style: {
					width: 44,
					height: 44
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fw-bold fs-5",
				children: value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted small",
				children: title
			})] })]
		})
	})
});
var ActivityLogsPage = () => {
	const { currentUser, addNotification } = useApp();
	const role = currentUser?.role || "Employee";
	const [allActivities, setAllActivities] = (0, import_react.useState)(SAMPLE_ACTIVITIES);
	const [visibleCount, setVisibleCount] = (0, import_react.useState)(PAGE_SIZE);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("all");
	const [dateFrom, setDateFrom] = (0, import_react.useState)("");
	const [dateTo, setDateTo] = (0, import_react.useState)("");
	const [liveUpdates, setLiveUpdates] = (0, import_react.useState)(true);
	const roleVisibleActivities = (0, import_react.useMemo)(() => {
		if (role === "Admin" || role === "HR" || role === "Manager") return allActivities;
		return allActivities.filter((a) => a.employee?.name === "You" || a.employee?.role === "Team Lead");
	}, [allActivities, role]);
	const filteredActivities = (0, import_react.useMemo)(() => {
		return roleVisibleActivities.filter((activity) => {
			const config = ACTIVITY_TYPE_CONFIG[activity.type];
			const matchesSearch = !searchQuery || activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || activity.description.toLowerCase().includes(searchQuery.toLowerCase()) || activity.employee?.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = categoryFilter === "all" || config?.category === categoryFilter;
			const matchesType = typeFilter === "all" || activity.type === typeFilter;
			const activityDate = new Date(activity.timestamp);
			const matchesDateFrom = !dateFrom || activityDate >= new Date(dateFrom);
			const matchesDateTo = !dateTo || activityDate <= /* @__PURE__ */ new Date(`${dateTo}T23:59:59`);
			return matchesSearch && matchesCategory && matchesType && matchesDateFrom && matchesDateTo;
		});
	}, [
		roleVisibleActivities,
		searchQuery,
		categoryFilter,
		typeFilter,
		dateFrom,
		dateTo
	]);
	const visibleActivities = filteredActivities.slice(0, visibleCount);
	const hasMore = visibleCount < filteredActivities.length;
	const stats = (0, import_react.useMemo)(() => ({
		total: filteredActivities.length,
		pending: filteredActivities.filter((a) => a.status === "pending").length,
		completed: filteredActivities.filter((a) => a.status === "completed" || a.status === "approved").length,
		new: filteredActivities.filter((a) => a.isNew).length
	}), [filteredActivities]);
	const handleLoadMore = (0, import_react.useCallback)(() => {
		setLoading(true);
		setTimeout(() => {
			const nextCount = visibleCount + PAGE_SIZE;
			if (nextCount >= allActivities.length && allActivities.length < SAMPLE_ACTIVITIES.length + EXTRA_ACTIVITIES.length) setAllActivities((prev) => [...prev, ...EXTRA_ACTIVITIES.filter((e) => !prev.find((p) => p.id === e.id))]);
			setVisibleCount(nextCount);
			setLoading(false);
		}, 600);
	}, [visibleCount, allActivities.length]);
	const handleExport = () => {
		const csvContent = [[
			"Title",
			"Description",
			"Date",
			"Status",
			"Employee",
			"Type"
		].join(","), ...filteredActivities.map((a) => [
			a.title,
			`"${a.description}"`,
			a.timestamp,
			a.status,
			a.employee?.name,
			a.type
		].join(","))].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `activity-logs-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
		link.click();
		URL.revokeObjectURL(url);
		addNotification("Activity logs exported successfully.", "success");
	};
	const handleEmployeeClick = (employee) => {
		addNotification(`Viewing profile: ${employee.name} (${employee.role})`, "info");
	};
	const handleClearFilters = () => {
		setSearchQuery("");
		setCategoryFilter("all");
		setTypeFilter("all");
		setDateFrom("");
		setDateTo("");
		setVisibleCount(PAGE_SIZE);
	};
	(0, import_react.useEffect)(() => {
		if (!liveUpdates) return void 0;
		const interval = setInterval(() => {
			setAllActivities((prev) => prev.map((a) => a.isNew ? {
				...a,
				isNew: false
			} : a));
		}, 15e3);
		return () => clearInterval(interval);
	}, [liveUpdates]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-1 fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Total Activities",
						value: stats.total,
						icon: faChartLine,
						color: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Pending",
						value: stats.pending,
						icon: faHourglassHalf,
						color: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Completed",
						value: stats.completed,
						icon: faCheckCircle,
						color: "success"
					}),
					stats.new > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "New Updates",
						value: stats.new,
						icon: faBell,
						color: "danger"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm mb-4",
				style: { borderRadius: "15px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
								className: "fw-bold mb-0 d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faFilter,
									className: "text-primary"
								}), "Filter Activity Logs"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "form-check form-switch mb-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "form-check-input",
										type: "checkbox",
										id: "liveUpdatesToggle",
										checked: liveUpdates,
										onChange: (e) => setLiveUpdates(e.target.checked)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "form-check-label small fw-bold text-muted",
										htmlFor: "liveUpdatesToggle",
										children: "Live Updates"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn btn-outline-primary btn-sm d-flex align-items-center gap-2",
									onClick: handleExport,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faDownload }), "Export CSV"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text bg-transparent border-end-0 text-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: "form-control border-start-0",
											placeholder: "Search activity, employee...",
											value: searchQuery,
											onChange: (e) => {
												setSearchQuery(e.target.value);
												setVisibleCount(PAGE_SIZE);
											}
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "form-select",
										value: categoryFilter,
										onChange: (e) => {
											setCategoryFilter(e.target.value);
											setVisibleCount(PAGE_SIZE);
										},
										children: ACTIVITY_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: cat.id,
											children: cat.label
										}, cat.id))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select",
										value: typeFilter,
										onChange: (e) => {
											setTypeFilter(e.target.value);
											setVisibleCount(PAGE_SIZE);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "All Activity Types"
										}), Object.entries(ACTIVITY_TYPE_CONFIG).map(([key, cfg]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: key,
											children: cfg.label
										}, key))]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "btn btn-light w-100 d-flex align-items-center justify-content-center gap-2",
										onClick: handleClearFilters,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFilter }), "Reset Filters"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "input-group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "input-group-text bg-transparent border-end-0 text-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalendar })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										className: "form-control border-start-0",
										value: dateFrom,
										onChange: (e) => {
											setDateFrom(e.target.value);
											setVisibleCount(PAGE_SIZE);
										}
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "input-group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "input-group-text bg-transparent border-end-0 text-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalendar })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										className: "form-control border-start-0",
										value: dateTo,
										onChange: (e) => {
											setDateTo(e.target.value);
											setVisibleCount(PAGE_SIZE);
										}
									})]
								})
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card border-0 shadow-sm overflow-hidden",
				style: { borderRadius: "15px" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faHistory,
							className: "me-2 text-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "mb-0 fw-bold",
							children: "Activity Timeline"
						})]
					}), liveUpdates && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "badge bg-success-subtle text-success x-small fw-bold text-uppercase",
						children: "Live Tracking Enabled"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-body p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTimeline, {
						activities: visibleActivities,
						onLoadMore: handleLoadMore,
						loading,
						hasMore,
						onEmployeeClick: handleEmployeeClick,
						totalCount: filteredActivities.length
					})
				})]
			}),
			role !== "Admin" && role !== "HR" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "alert alert-light border mt-4 mb-0 d-flex align-items-center gap-2 small text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faShieldHalved,
						className: "text-primary"
					}),
					"Showing activities visible to your role (",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: role }),
					"). Admin and HR users can view all workforce activity."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .x-small { font-size: 10px; }
        .extra-small { font-size: 10px; }
        .transition { transition: all 0.2s; }
        .hover-lift-sm:hover { transform: translateY(-1px); border-color: #e2e8f0 !important; }
      ` })
		]
	});
};
//#endregion
export { ActivityLogsPage as default };
