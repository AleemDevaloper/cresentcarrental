import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Br as faFileExport, Dl as require_jsx_runtime, Er as faEye, G as faArrowUp, Ia as faMinus, Jc as faUserPlus, M as faArrowDown, _c as faTrash, gr as faEllipsisVertical, oo as faPen, ru as require_react, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
import { C as useReactTable, S as flexRender, w as getCoreRowModel } from "./superadmin-Cn5Mt1aQ.js";
//#region src/pages/organization/teams/TeamsTable.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PerformanceBadge = ({ value, trend }) => {
	let bgColor = "bg-success";
	if (value < 50) bgColor = "bg-danger";
	else if (value < 80) bgColor = "bg-warning";
	const trendIcon = trend === "up" ? faArrowUp : trend === "down" ? faArrowDown : faMinus;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `badge ${bgColor} text-white px-2 py-1 d-inline-flex align-items-center gap-1`,
		style: {
			borderRadius: 6,
			fontSize: "12px"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: trendIcon,
				style: { fontSize: "10px" }
			}),
			value,
			"%"
		]
	});
};
var StatusBadge = ({ status }) => {
	let colorClass = "text-success bg-success-subtle";
	if (status === "Inactive") colorClass = "text-danger bg-danger-subtle";
	if (status === "Onboarding" || status === "Pending") colorClass = "text-warning bg-warning-subtle";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `badge ${colorClass} px-3 py-2 rounded-pill fw-bold`,
		style: { fontSize: "11px" },
		children: status
	});
};
var TeamLeadCell = ({ name }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex align-items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm",
			style: {
				width: 32,
				height: 32,
				backgroundColor: "#64748b",
				fontSize: "12px"
			},
			children: name.split(" ").map((n) => n[0]).join("").toUpperCase()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "fw-medium text-dark",
			style: { fontSize: "15px" },
			children: name
		})]
	});
};
var TeamsTable = ({ teams, onAction, loading }) => {
	const columns = (0, import_react.useMemo)(() => [
		{
			id: "select",
			header: ({ table }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				className: "form-check-input ms-2",
				checked: table.getIsAllPageRowsSelected(),
				onChange: table.getToggleAllPageRowsSelectedHandler()
			}),
			cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				className: "form-check-input ms-2",
				checked: row.getIsSelected(),
				onChange: row.getToggleSelectedHandler()
			})
		},
		{
			accessorKey: "name",
			header: "Team Name",
			cell: (info) => {
				const name = info.getValue();
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm",
						style: {
							width: 42,
							height: 42,
							backgroundColor: "rgba(99, 102, 241, 0.1)",
							color: "#6366f1",
							fontSize: "14px"
						},
						children: name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "fw-bold text-dark",
						children: name
					})]
				});
			}
		},
		{
			accessorKey: "manager",
			header: "Team Lead",
			cell: (info) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLeadCell, { name: info.getValue() })
		},
		{
			accessorKey: "members",
			header: "Members",
			cell: (info) => {
				const members = info.getValue() || [];
				const totalCount = info.row.original.memberCount;
				const displayMembers = members.slice(0, 3);
				const extra = totalCount - displayMembers.length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center team-avatar-stack",
					children: [displayMembers.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-circle border border-2 border-white shadow-sm d-flex align-items-center justify-content-center fw-bold text-white transition",
						style: {
							width: 32,
							height: 32,
							backgroundColor: m.color,
							marginLeft: i > 0 ? -12 : 0,
							fontSize: "10px",
							zIndex: 10 - i,
							cursor: "pointer"
						},
						title: m.name,
						children: m.initials
					}, m.id)), extra > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-circle border border-2 border-white shadow-sm d-flex align-items-center justify-content-center fw-bold text-dark bg-light transition",
						style: {
							width: 32,
							height: 32,
							marginLeft: -12,
							fontSize: "10px",
							zIndex: 0
						},
						children: ["+", extra]
					})]
				});
			}
		},
		{
			accessorKey: "productivityPercent",
			header: "Performance",
			cell: (info) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceBadge, {
				value: info.getValue(),
				trend: info.row.original.trend
			})
		},
		{
			accessorKey: "efficiency",
			header: "Efficiency",
			cell: (info) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "progress flex-grow-1",
					style: {
						height: "6px",
						minWidth: "60px",
						borderRadius: "3px"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `progress-bar ${info.getValue() > 80 ? "bg-success" : info.getValue() > 50 ? "bg-warning" : "bg-danger"}`,
						role: "progressbar",
						style: { width: `${info.getValue()}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "small fw-bold text-muted",
					children: [info.getValue(), "%"]
				})]
			})
		},
		{
			accessorKey: "totalWorked",
			header: "Worked Hours",
			cell: (info) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fw-semibold text-dark text-end pe-4",
				children: [info.getValue(), "h"]
			})
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: (info) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: info.getValue() })
		},
		{
			id: "actions",
			header: "",
			cell: (info) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "dropdown text-end pe-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-link text-muted p-0",
					type: "button",
					"data-bs-toggle": "dropdown",
					"aria-expanded": "false",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEllipsisVertical })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "dropdown-menu dropdown-menu-end shadow border-0 rounded-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "dropdown-item py-2",
							onClick: () => onAction("view", info.row.original),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faEye,
								className: "me-2 text-primary opacity-75"
							}), " View Team"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "dropdown-item py-2",
							onClick: () => onAction("edit", info.row.original),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPen,
								className: "me-2 text-info opacity-75"
							}), " Edit Team"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "dropdown-item py-2",
							onClick: () => onAction("assign", info.row.original),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faUserPlus,
								className: "me-2 text-success opacity-75"
							}), " Assign Members"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "dropdown-item py-2",
							onClick: () => onAction("export", info.row.original),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faFileExport,
								className: "me-2 text-secondary opacity-75"
							}), " Export"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "dropdown-divider" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "dropdown-item py-2 text-danger",
							onClick: () => onAction("delete", info.row.original),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faTrash,
								className: "me-2 opacity-75"
							}), " Delete"]
						}) })
					]
				})]
			})
		}
	], [onAction]);
	const [rowSelection, setRowSelection] = import_react.useState({});
	const table = useReactTable({
		data: teams,
		columns,
		state: { rowSelection },
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel()
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card border-0 shadow-sm p-5 text-center",
		style: { borderRadius: 16 },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "spinner-border text-primary mx-auto mb-3",
			role: "status",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "visually-hidden",
				children: "Loading..."
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted mb-0",
			children: "Loading teams data..."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card border-0 shadow-sm overflow-hidden mb-4",
		style: { borderRadius: 16 },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "table-responsive",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "table table-hover align-middle mb-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-light",
					children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: headerGroup.headers.map((header) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "border-0 text-uppercase text-muted x-small fw-bold py-3 px-4",
						style: { letterSpacing: "0.5px" },
						children: header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
					}, header.id)) }, headerGroup.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: table.getRowModel().rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "transition",
					style: {
						height: 80,
						cursor: "pointer"
					},
					children: row.getVisibleCells().map((cell) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "border-bottom-0 px-4 py-3",
						style: { borderBottom: "1px solid #f1f5f9" },
						children: flexRender(cell.column.columnDef.cell, cell.getContext())
					}, cell.id))
				}, row.id)) })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .table-hover tbody tr:hover {
          background-color: #f8fafc !important;
        }
        .team-avatar-stack .rounded-circle:hover {
          transform: translateY(-2px);
          z-index: 20 !important;
        }
      ` })]
	});
};
//#endregion
export { TeamsTable as t };
