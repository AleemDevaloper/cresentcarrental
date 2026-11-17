import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Ac as faUndo, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Ga as faMoneyBillWave, P as faArrowLeft, Uc as faUserGraduate, _c as faTrash, bl as useApp, d as useTranslation, fr as faEdit, os as faSearch, pt as faBookmark, ru as require_react, tl as faUsers, ut as faBook, vl as FontAwesomeIcon } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/EMS/Library/Library.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Science",
	"Literature",
	"Technology",
	"History",
	"Arts",
	"Mathematics",
	"Philosophy"
];
var STATUSES = [
	"Available",
	"Issued",
	"Reserved",
	"Lost",
	"Damaged"
];
var initialForm = {
	title: "",
	author: "",
	isbn: "",
	publisher: "",
	category: "",
	copies: 1,
	shelfLocation: "",
	description: ""
};
var Library = () => {
	const { addNotification, theme } = useApp();
	const { t } = useTranslation();
	const isDark = theme === "dark";
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		category: "",
		status: ""
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)(initialForm);
	const [activeTab, setActiveTab] = (0, import_react.useState)("books");
	const [showIssueReturn, setShowIssueReturn] = (0, import_react.useState)(false);
	const [showMembers, setShowMembers] = (0, import_react.useState)(false);
	const [showFine, setShowFine] = (0, import_react.useState)(false);
	const [issueData, setIssueData] = (0, import_react.useState)({
		member: "",
		book: "",
		dueDate: ""
	});
	const [members, setMembers] = (0, import_react.useState)([]);
	const [fineData, setFineData] = (0, import_react.useState)({});
	const textColor = isDark ? "#f1f5f9" : "#1e293b";
	const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	(0, import_react.useEffect)(() => {
		fetchData();
		fetchMembers();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setData([
				{
					id: 1,
					title: "Introduction to AI",
					author: "John McCarthy",
					isbn: "978-0-13-604259-4",
					category: "Technology",
					copies: 10,
					available: 6,
					status: "Available"
				},
				{
					id: 2,
					title: "Calculus Made Easy",
					author: "Silvanus Thompson",
					isbn: "978-0-312-70980-7",
					category: "Mathematics",
					copies: 8,
					available: 3,
					status: "Available"
				},
				{
					id: 3,
					title: "The Great Gatsby",
					author: "F. Scott Fitzgerald",
					isbn: "978-0-7432-7356-5",
					category: "Literature",
					copies: 12,
					available: 8,
					status: "Available"
				},
				{
					id: 4,
					title: "Clean Code",
					author: "Robert C. Martin",
					isbn: "978-0-13-235088-4",
					category: "Technology",
					copies: 6,
					available: 1,
					status: "Available"
				},
				{
					id: 5,
					title: "Atomic Habits",
					author: "James Clear",
					isbn: "978-0-7352-1129-2",
					category: "Philosophy",
					copies: 15,
					available: 10,
					status: "Available"
				},
				{
					id: 6,
					title: "A Brief History of Time",
					author: "Stephen Hawking",
					isbn: "978-0-553-38016-3",
					category: "Science",
					copies: 5,
					available: 2,
					status: "Available"
				},
				{
					id: 7,
					title: "The Art of War",
					author: "Sun Tzu",
					isbn: "978-1-59030-225-5",
					category: "History",
					copies: 7,
					available: 5,
					status: "Available"
				}
			]);
		} catch (err) {
			setError(err.message || "Failed to load books");
		} finally {
			setLoading(false);
		}
	};
	const fetchMembers = async () => {
		try {
			await new Promise((r) => setTimeout(r, 200));
			setMembers([
				{
					id: 1,
					name: "Ali Ahmed",
					email: "ali@example.com",
					phone: "+92 300 1234567",
					booksIssued: 2,
					fines: 150
				},
				{
					id: 2,
					name: "Sara Khan",
					email: "sara@example.com",
					phone: "+92 300 7654321",
					booksIssued: 1,
					fines: 0
				},
				{
					id: 3,
					name: "Usman Ali",
					email: "usman@example.com",
					phone: "+92 300 1112233",
					booksIssued: 3,
					fines: 500
				}
			]);
		} catch (err) {
			console.error("Failed to load members", err);
		}
	};
	const openAddForm = () => {
		setEditItem(null);
		setFormData(initialForm);
		setShowModal(true);
	};
	const openEditForm = (item) => {
		setEditItem(item);
		setFormData({
			title: item.title || "",
			author: item.author || "",
			isbn: item.isbn || "",
			publisher: item.publisher || "",
			category: item.category || "",
			copies: item.copies || 1,
			shelfLocation: item.shelfLocation || "",
			description: item.description || ""
		});
		setShowModal(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.title || !formData.author || !formData.isbn) {
			addNotification?.("Please fill all required fields", "warning");
			return;
		}
		try {
			await new Promise((r) => setTimeout(r, 300));
			addNotification?.(editItem ? "Book updated successfully" : "Book added successfully", "success");
			setShowModal(false);
			setEditItem(null);
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Error saving book", "danger");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this book?")) return;
		try {
			await new Promise((r) => setTimeout(r, 200));
			addNotification?.("Book deleted", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Delete failed", "danger");
		}
	};
	const handleIssue = async () => {
		if (!issueData.member || !issueData.book || !issueData.dueDate) {
			addNotification?.("Please fill all fields", "warning");
			return;
		}
		try {
			await new Promise((r) => setTimeout(r, 200));
			addNotification?.("Book issued successfully", "success");
			setShowIssueReturn(false);
			setIssueData({
				member: "",
				book: "",
				dueDate: ""
			});
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Failed to issue book", "danger");
		}
	};
	const handleReturn = async (bookId) => {
		try {
			await new Promise((r) => setTimeout(r, 200));
			addNotification?.("Book returned successfully", "success");
			fetchData();
		} catch (err) {
			addNotification?.(err.message || "Failed to return book", "danger");
		}
	};
	const handleCollectFine = async (memberId) => {
		try {
			await new Promise((r) => setTimeout(r, 200));
			addNotification?.("Fine collected successfully", "success");
			setFineData({});
			fetchMembers();
		} catch (err) {
			addNotification?.(err.message || "Failed to collect fine", "danger");
		}
	};
	const getStatusBadge = (status, available) => {
		if (status === "Lost") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "badge bg-danger-subtle text-danger rounded-pill",
			children: "Lost"
		});
		if (available === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "badge bg-warning-subtle text-warning rounded-pill",
			children: "All Issued"
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "badge bg-success-subtle text-success rounded-pill",
			children: "Available"
		});
	};
	if (showFine) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 ${isDark ? "text-white" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex align-items-center gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn btn-sm btn-outline-secondary rounded-3",
				onClick: () => setShowFine(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faArrowLeft,
					className: "me-1"
				}), " Back"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
				className: "fw-bold mb-0",
				style: { color: textColor },
				children: "Fine Collection"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "table-responsive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "table table-hover align-middle mb-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: `${isDark ? "bg-dark-subtle" : "bg-light"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "ps-4",
									children: "Member"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Email" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Books Issued" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Fine Amount" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4 text-end",
									children: "Actions"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "ps-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUserGraduate,
									className: "text-primary opacity-50"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "fw-semibold small",
									children: m.name
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: m.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: m.booksIssued
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `fw-bold small ${m.fines > 0 ? "text-danger" : "text-success"}`,
							children: ["Rs. ", m.fines]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "pe-4 text-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-sm btn-warning rounded-3",
								onClick: () => handleCollectFine(m.id),
								disabled: m.fines === 0,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faMoneyBillWave,
									className: "me-1"
								}), " Collect Fine"]
							})
						})
					] }, m.id)) })]
				})
			})
		})]
	});
	if (showMembers) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 ${isDark ? "text-white" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex align-items-center justify-content-between mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-sm btn-outline-secondary rounded-3",
					onClick: () => setShowMembers(false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faArrowLeft,
						className: "me-1"
					}), " Back"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
					className: "fw-bold mb-0",
					style: { color: textColor },
					children: "Library Members"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn btn-primary rounded-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faPlus,
					className: "me-2"
				}), "Add Member"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "table-responsive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "table table-hover align-middle mb-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: `${isDark ? "bg-dark-subtle" : "bg-light"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "ps-4",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Email" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Phone" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Books Issued" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Fines" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4 text-end",
									children: "Actions"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "ps-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUserGraduate,
									className: "text-primary opacity-50"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "fw-semibold small",
									children: m.name
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: m.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: m.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "small",
							children: m.booksIssued
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `fw-bold small ${m.fines > 0 ? "text-danger" : "text-success"}`,
							children: ["Rs. ", m.fines]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "pe-4 text-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm btn-light border rounded-3 me-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm btn-danger rounded-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
							})]
						})
					] }, m.id)) })]
				})
			})
		})]
	});
	if (showIssueReturn) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 ${isDark ? "text-white" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex align-items-center gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn btn-sm btn-outline-secondary rounded-3",
				onClick: () => setShowIssueReturn(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faArrowLeft,
					className: "me-1"
				}), " Back"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
				className: "fw-bold mb-0",
				style: { color: textColor },
				children: "Issue / Return Book"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-md-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-body p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-3",
								style: { color: textColor },
								children: "Issue Book"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "small fw-bold text-muted mb-2",
									children: "Member"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select rounded-3",
									value: issueData.member,
									onChange: (e) => setIssueData({
										...issueData,
										member: e.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select Member"
									}), members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: m.name,
										children: m.name
									}, m.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "small fw-bold text-muted mb-2",
									children: "Book"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select rounded-3",
									value: issueData.book,
									onChange: (e) => setIssueData({
										...issueData,
										book: e.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select Book"
									}), data.filter((b) => b.available > 0).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: b.title,
										children: [
											b.title,
											" (",
											b.available,
											" available)"
										]
									}, b.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "small fw-bold text-muted mb-2",
									children: "Due Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									className: "form-control rounded-3",
									value: issueData.dueDate,
									onChange: (e) => setIssueData({
										...issueData,
										dueDate: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary rounded-3 w-100",
								onClick: handleIssue,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBookmark,
									className: "me-2"
								}), " Issue Book"]
							})
						]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-md-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `card border-0 shadow-sm rounded-4 h-100 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-body p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-3",
								style: { color: textColor },
								children: "Return Book"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "small fw-bold text-muted mb-2",
									children: "Search Issued Books"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: "form-control rounded-3",
									placeholder: "Search by title or member..."
								})]
							}),
							data.filter((b) => b.available < b.copies).slice(0, 3).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center justify-content-between p-3 mb-2 rounded-3",
								style: {
									background: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fc",
									border: `1px solid ${borderColor}`
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small fw-bold",
									style: { color: textColor },
									children: b.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "x-small text-muted",
									children: [
										"Issued: ",
										b.copies - b.available,
										" copies"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm btn-success rounded-3",
									onClick: () => handleReturn(b.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUndo,
										className: "me-1"
									}), " Return"]
								})]
							}, b.id)),
							data.filter((b) => b.available < b.copies).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center text-muted py-3 small",
								children: "No books currently issued"
							})
						]
					})
				})
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `p-4 ${isDark ? "bg-dark text-light" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "fw-bold mb-1",
					children: "Library"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `small mb-0 ${isDark ? "text-light opacity-75" : "text-muted"}`,
					children: "Manage books, members, and circulation"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-success rounded-3",
						onClick: () => {
							setShowIssueReturn(true);
							setActiveTab("issues");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faBookmark,
							className: "me-2"
						}), "Issue/Return"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary rounded-3",
						onClick: openAddForm,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPlus,
							className: "me-2"
						}), "Add Book"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "nav nav-pills mb-4 gap-2",
				children: [
					{
						key: "books",
						label: "Books",
						icon: faBook
					},
					{
						key: "members",
						label: "Members",
						icon: faUsers
					},
					{
						key: "issues",
						label: "Issue/Return",
						icon: faBookmark
					},
					{
						key: "fines",
						label: "Fines",
						icon: faMoneyBillWave
					}
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "nav-item",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `nav-link rounded-3 d-flex align-items-center gap-2 ${activeTab === tab.key ? "active" : ""}`,
						onClick: () => {
							setActiveTab(tab.key);
							if (tab.key === "members") setShowMembers(true);
							if (tab.key === "issues") setShowIssueReturn(true);
							if (tab.key === "fines") setShowFine(true);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: tab.icon }),
							" ",
							tab.label
						]
					})
				}, tab.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "position-relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "position-absolute top-50 translate-middle-y ms-3 text-muted",
									style: { zIndex: 5 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: `form-control rounded-3 ps-5 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
									placeholder: "Search by title, author, ISBN...",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.category,
								onChange: (e) => setFilters({
									...filters,
									category: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Categories"
								}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: `form-select rounded-3 ${isDark ? "bg-dark border-secondary text-light" : ""}`,
								value: filters.status,
								onChange: (e) => setFilters({
									...filters,
									status: e.target.value
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Status"
								}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-outline-secondary rounded-3 w-100",
								onClick: () => {
									setSearch("");
									setFilters({
										category: "",
										status: ""
									});
								},
								children: "Reset"
							})
						})
					]
				})
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExclamationTriangle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn-close ms-auto",
						onClick: () => setError(null)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark border-1 border-secondary" : "bg-white"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "table table-hover align-middle mb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: `${isDark ? "bg-dark-subtle" : "bg-light"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: `small text-uppercase ${isDark ? "text-light opacity-50" : "text-muted"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "ps-4",
										children: "Book Title"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Author" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ISBN" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Category" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Copies" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Available" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4 text-end",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: "8",
							className: "text-center py-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner-border text-primary" })
						}) }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "8",
							className: "text-center py-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBook,
									className: "fs-1 text-muted opacity-50 mb-3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold",
									children: "No books found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `small ${isDark ? "text-light opacity-50" : "text-muted"}`,
									children: "Add a new book to get started"
								})
							]
						}) }) : data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "ps-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faBook,
										className: "text-primary opacity-50"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold small",
										children: item.title
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small",
								children: item.author
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "small",
								children: item.isbn
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-light text-dark rounded-pill",
								children: item.category
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "small fw-bold",
								children: item.copies
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `fw-bold small ${item.available === 0 ? "text-danger" : "text-success"}`,
								children: item.available
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "progress rounded-pill",
								style: {
									height: "4px",
									width: "50px"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress-bar",
									style: {
										width: `${item.available / (item.copies || 1) * 100}%`,
										background: item.available === 0 ? "#ef4444" : "#10b981"
									}
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(item.status, item.available) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "pe-4 text-end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-light border rounded-3 me-1",
										onClick: () => {
											setShowIssueReturn(true);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBookmark })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-light border rounded-3 me-1",
										onClick: () => openEditForm(item),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-sm btn-danger rounded-3",
										onClick: () => handleDelete(item.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
									})
								]
							})
						] }, item.id)) })]
					})
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content border-0 shadow-lg rounded-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editItem ? "Edit Book" : "Add Book"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "modal-body p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-8",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												required: true,
												value: formData.title,
												onChange: (e) => setFormData({
													...formData,
													title: e.target.value
												}),
												placeholder: "Book title"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["ISBN ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												required: true,
												value: formData.isbn,
												onChange: (e) => setFormData({
													...formData,
													isbn: e.target.value
												}),
												placeholder: "ISBN"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "small fw-bold text-muted mb-2",
												children: ["Author ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-danger",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												required: true,
												value: formData.author,
												onChange: (e) => setFormData({
													...formData,
													author: e.target.value
												}),
												placeholder: "Author name"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Publisher"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												value: formData.publisher,
												onChange: (e) => setFormData({
													...formData,
													publisher: e.target.value
												}),
												placeholder: "Publisher"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Category"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select rounded-3",
												value: formData.category,
												onChange: (e) => setFormData({
													...formData,
													category: e.target.value
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Category"
												}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: c,
													children: c
												}, c))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Copies"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control rounded-3",
												value: formData.copies,
												onChange: (e) => setFormData({
													...formData,
													copies: Number(e.target.value)
												}),
												min: "1"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Shelf Location"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control rounded-3",
												value: formData.shelfLocation,
												onChange: (e) => setFormData({
													...formData,
													shelfLocation: e.target.value
												}),
												placeholder: "e.g. A-12"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-12",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "small fw-bold text-muted mb-2",
												children: "Description"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												className: "form-control rounded-3",
												rows: "3",
												value: formData.description,
												onChange: (e) => setFormData({
													...formData,
													description: e.target.value
												}),
												placeholder: "Book description"
											})]
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 p-4 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light rounded-3 px-4",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "btn btn-primary rounded-3 px-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faBook,
										className: "me-2"
									}), editItem ? "Update Book" : "Add Book"]
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.x-small { font-size: 11px; }` })
		]
	});
};
//#endregion
export { Library as default };
