import "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, in as faChevronRight, rn as faChevronLeft, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/organization/teams/teamsData.jsx
var AVATAR_COLORS = [
	"#6366F1",
	"#10B981",
	"#F59E0B",
	"#EF4444",
	"#0EA5E9",
	"#8B5CF6",
	"#EC4899",
	"#14B8A6"
];
var DEPARTMENTS = [
	"All Departments",
	"Engineering",
	"Design",
	"Operations",
	"Security",
	"Support"
];
var MANAGERS = [
	"All Managers",
	"Sarah Chen",
	"Alex Rivera",
	"Jordan Lee",
	"Morgan Taylor"
];
var TEAM_STATUSES = [
	"All Status",
	"Active",
	"Inactive",
	"Onboarding"
];
var parseTimeToMinutes = (timeStr) => {
	const [h, m] = timeStr.split(":").map(Number);
	return (h || 0) * 60 + (m || 0);
};
var calcProgress = (part, total) => {
	if (!total) return 0;
	return Math.round(part / total * 100);
};
var buildMembers = (count, seed) => {
	const names = [
		"Alice",
		"Bob",
		"Carol",
		"David",
		"Eva",
		"Frank",
		"Grace",
		"Henry",
		"Ivy",
		"Jack"
	];
	return Array.from({ length: Math.min(count, 4) }, (_, i) => ({
		id: `${seed}-${i}`,
		name: names[(seed + i) % names.length],
		initials: names[(seed + i) % names.length].slice(0, 2).toUpperCase(),
		color: AVATAR_COLORS[(seed + i) % AVATAR_COLORS.length]
	}));
};
var SAMPLE_TEAMS = [
	{
		id: 1,
		name: "UX Research",
		department: "Design",
		manager: "Sarah Chen",
		status: "Active",
		memberCount: 5,
		members: buildMembers(5, 1),
		totalWorked: "458",
		productive: "420:24",
		manual: "20:24",
		unproductive: "17:12",
		efficiency: 97,
		productivityPercent: 97,
		trend: "up",
		createdAt: "2025-12-24",
		activeProjects: 7,
		openTasks: 54,
		completedTasks: 412,
		attendance: 98,
		capacity: 82,
		skills: [
			"User Research",
			"Figma",
			"Usability Testing",
			"Wireframing"
		]
	},
	{
		id: 2,
		name: "DevOps",
		department: "Engineering",
		manager: "John Mitchell",
		status: "Busy",
		memberCount: 8,
		members: buildMembers(8, 2),
		totalWorked: "988",
		productive: "850:10",
		manual: "100:00",
		unproductive: "37:50",
		efficiency: 88,
		productivityPercent: 88,
		trend: "up",
		createdAt: "2025-12-10",
		activeProjects: 12,
		openTasks: 120,
		completedTasks: 850,
		attendance: 95,
		capacity: 94,
		skills: [
			"Docker",
			"Kubernetes",
			"CI/CD",
			"AWS",
			"Terraform"
		]
	},
	{
		id: 3,
		name: "Testing",
		department: "Engineering",
		manager: "Lisa Thompson",
		status: "Active",
		memberCount: 4,
		members: buildMembers(4, 3),
		totalWorked: "699",
		productive: "600:20",
		manual: "50:10",
		unproductive: "48:30",
		efficiency: 69,
		productivityPercent: 69,
		trend: "stable",
		createdAt: "2025-11-27",
		activeProjects: 5,
		openTasks: 45,
		completedTasks: 320,
		attendance: 92,
		capacity: 75,
		skills: [
			"Selenium",
			"Jest",
			"Cypress",
			"QA Automation"
		]
	},
	{
		id: 4,
		name: "Cloud Computing",
		department: "Engineering",
		manager: "Michael Rodriguez",
		status: "At Risk",
		memberCount: 12,
		members: buildMembers(12, 4),
		totalWorked: "360",
		productive: "320:00",
		manual: "25:20",
		unproductive: "14:40",
		efficiency: 44,
		productivityPercent: 44,
		trend: "down",
		createdAt: "2025-11-06",
		activeProjects: 15,
		openTasks: 180,
		completedTasks: 600,
		attendance: 88,
		capacity: 98,
		skills: [
			"Azure",
			"GCP",
			"Serverless",
			"Cloud Security"
		]
	},
	{
		id: 5,
		name: "Cybersecurity",
		department: "Security",
		manager: "Sarah Lee",
		status: "On Hold",
		memberCount: 5,
		members: buildMembers(5, 5),
		totalWorked: "96",
		productive: "80:10",
		manual: "10:30",
		unproductive: "05:20",
		efficiency: 49,
		productivityPercent: 49,
		trend: "down",
		createdAt: "2025-10-15",
		activeProjects: 4,
		openTasks: 32,
		completedTasks: 150,
		attendance: 99,
		capacity: 40,
		skills: [
			"Penetration Testing",
			"SIEM",
			"Compliance",
			"Encryption"
		]
	},
	{
		id: 6,
		name: "Data & Analytics",
		department: "Operations",
		manager: "Natalie Brooks",
		status: "Active",
		memberCount: 7,
		members: buildMembers(7, 6),
		totalWorked: "48",
		productive: "40:00",
		manual: "05:30",
		unproductive: "02:30",
		efficiency: 66,
		productivityPercent: 66,
		trend: "up",
		createdAt: "2025-09-20"
	},
	{
		id: 7,
		name: "IT Support",
		department: "Support",
		manager: "David Nguyen",
		status: "Active",
		memberCount: 4,
		members: buildMembers(4, 7),
		totalWorked: "120",
		productive: "100:00",
		manual: "15:10",
		unproductive: "04:50",
		efficiency: 42,
		productivityPercent: 42,
		trend: "down",
		createdAt: "2025-08-15"
	},
	{
		id: 8,
		name: "Networking",
		department: "Engineering",
		manager: "Morgan Taylor",
		status: "Onboarding",
		memberCount: 6,
		members: buildMembers(6, 8),
		totalWorked: "250",
		productive: "200:20",
		manual: "30:10",
		unproductive: "19:30",
		efficiency: 33,
		productivityPercent: 33,
		trend: "stable",
		createdAt: "2025-07-01"
	},
	{
		id: 9,
		name: "Mobile App",
		department: "Engineering",
		manager: "John Mitchell",
		status: "Active",
		memberCount: 9,
		members: buildMembers(9, 9),
		totalWorked: "850",
		productive: "800:15",
		manual: "30:00",
		unproductive: "19:45",
		efficiency: 99,
		productivityPercent: 99,
		trend: "up",
		createdAt: "2025-06-15"
	},
	{
		id: 10,
		name: "Design",
		department: "Design",
		manager: "Lisa Thompson",
		status: "Active",
		memberCount: 6,
		members: buildMembers(6, 10),
		totalWorked: "420",
		productive: "380:00",
		manual: "25:00",
		unproductive: "15:00",
		efficiency: 87,
		productivityPercent: 87,
		trend: "up",
		createdAt: "2025-05-20"
	},
	{
		id: 11,
		name: "AI Engineering",
		department: "Engineering",
		manager: "Michael Rodriguez",
		status: "Active",
		memberCount: 15,
		members: buildMembers(15, 11),
		totalWorked: "1200",
		productive: "1100:00",
		manual: "60:00",
		unproductive: "40:00",
		efficiency: 95,
		productivityPercent: 95,
		trend: "up",
		createdAt: "2025-04-10"
	},
	{
		id: 12,
		name: "Customer Success",
		department: "Support",
		manager: "Natalie Brooks",
		status: "Active",
		memberCount: 5,
		members: buildMembers(5, 12),
		totalWorked: "300",
		productive: "250:00",
		manual: "30:00",
		unproductive: "20:00",
		efficiency: 82,
		productivityPercent: 82,
		trend: "stable",
		createdAt: "2025-03-05"
	}
];
var SORT_OPTIONS = [
	{
		id: "newest",
		label: "Newest"
	},
	{
		id: "oldest",
		label: "Oldest"
	},
	{
		id: "highest_productivity",
		label: "Highest Productivity"
	},
	{
		id: "lowest_productivity",
		label: "Lowest Productivity"
	},
	{
		id: "most_members",
		label: "Most Members"
	}
];
require_react();
var import_jsx_runtime = require_jsx_runtime();
var TeamMemberAvatars = ({ members, totalCount }) => {
	const extra = totalCount - members.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex align-items-center team-avatar-stack",
		children: [members.map((member, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "team-avatar rounded-circle d-flex align-items-center justify-content-center border border-2 border-white shadow-sm transition hover-lift",
			style: {
				width: 36,
				height: 36,
				backgroundColor: member.color,
				color: "#fff",
				fontSize: 11,
				fontWeight: 700,
				marginLeft: index > 0 ? -12 : 0,
				zIndex: members.length - index,
				cursor: "pointer"
			},
			title: member.name,
			children: member.initials
		}, member.id)), extra > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "team-avatar rounded-circle d-flex align-items-center justify-content-center border border-2 border-white bg-light text-muted shadow-sm small fw-bold",
			style: {
				width: 36,
				height: 36,
				marginLeft: -12,
				zIndex: 0,
				fontSize: 11
			},
			children: ["+", extra]
		})]
	});
};
//#endregion
//#region src/pages/organization/teams/TeamsPagination.jsx
var TeamsPagination = ({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange, totalItems }) => {
	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalItems);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 px-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted small fw-medium",
						children: "Show Per Page"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "form-select form-select-sm border-0 shadow-sm",
						style: {
							width: "auto",
							backgroundColor: "#fff",
							borderRadius: 8,
							cursor: "pointer"
						},
						value: pageSize,
						onChange: (e) => onPageSizeChange(Number(e.target.value)),
						children: [
							10,
							25,
							50,
							100
						].map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: size,
							children: size
						}, size))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted small",
					children: [
						"Showing ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "fw-bold text-dark",
							children: [
								startItem,
								"-",
								endItem
							]
						}),
						" of ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "fw-bold text-dark",
							children: totalItems
						}),
						" teams"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Teams pagination",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "pagination pagination-sm mb-0 gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: `page-item ${currentPage === 1 ? "disabled" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "page-link border-0 shadow-sm rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 32,
									height: 32
								},
								onClick: () => onPageChange(currentPage - 1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChevronLeft })
							})
						}),
						[...Array(totalPages)].map((_, i) => {
							const pageNum = i + 1;
							if (totalPages > 5) {
								if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
									if (pageNum === 2 || pageNum === totalPages - 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "px-1 text-muted",
										children: "..."
									}, pageNum);
									return null;
								}
							}
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: `page-item ${currentPage === pageNum ? "active" : ""}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `page-link border-0 shadow-sm rounded-3 d-flex align-items-center justify-content-center fw-bold ${currentPage === pageNum ? "bg-primary text-white" : "bg-white text-muted"}`,
									style: {
										width: 32,
										height: 32
									},
									onClick: () => onPageChange(pageNum),
									children: pageNum
								})
							}, pageNum);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: `page-item ${currentPage === totalPages ? "disabled" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "page-link border-0 shadow-sm rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 32,
									height: 32
								},
								onClick: () => onPageChange(currentPage + 1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChevronRight })
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .pagination .page-link {
          transition: all 0.2s ease;
        }
        .pagination .page-link:hover:not(.bg-primary) {
          background-color: #f8fafc !important;
          color: var(--bs-primary) !important;
        }
      ` })
		]
	});
};
//#endregion
export { SAMPLE_TEAMS as a, calcProgress as c, MANAGERS as i, parseTimeToMinutes as l, TeamMemberAvatars as n, SORT_OPTIONS as o, DEPARTMENTS as r, TEAM_STATUSES as s, TeamsPagination as t };
