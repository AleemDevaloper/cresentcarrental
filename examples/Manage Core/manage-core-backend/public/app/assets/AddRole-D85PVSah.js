import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, bl as useApp, ru as require_react } from "./ai-BHgPkVLC.js";
import { At as FiZap, B as FiArrowLeft, Gt as useParams, H as FiAward, K as FiCheckCircle, L as FiActivity, M as Common, O as TopNavBar, Q as FiCpu, St as FiStar, Tt as FiUser, U as FiBriefcase, Wt as useNavigate, X as FiCommand, Y as FiCode, _t as FiSave, at as FiInfo, bt as FiSettings, lt as FiMail, ot as FiKey, pt as FiPhone, rt as FiGlobe, ut as FiMessageCircle, xt as FiShield } from "./superadmin-Cn5Mt1aQ.js";
import { a as updateRole, i as listRoles, n as createRole } from "./roles-CNnFlAEt.js";
//#region src/pages/Permissions&Modules/AddRole.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AddRole = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { addNotification, setActiveTab } = useApp();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [isSidebarOpen, setIsSidebarOpen] = (0, import_react.useState)(true);
	const [selectedPermissions, setSelectedPermissions] = (0, import_react.useState)([]);
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		description: "",
		color: "#4F46E5",
		icon: "FiShield",
		level: 1,
		status: true
	});
	const colors = [
		"#4F46E5",
		"#6366F1",
		"#EC4899",
		"#EF4444",
		"#F59E0B",
		"#10B981",
		"#3B82F6",
		"#8B5CF6",
		"#06B6D4",
		"#64748B",
		"#F43F5E",
		"#14B8A6"
	];
	const availableIcons = [
		{
			name: "FiShield",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, {})
		},
		{
			name: "FiUser",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiUser, {})
		},
		{
			name: "FiStar",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiStar, {})
		},
		{
			name: "FiBriefcase",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiBriefcase, {})
		},
		{
			name: "FiCode",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCode, {})
		},
		{
			name: "FiCpu",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCpu, {})
		},
		{
			name: "FiSettings",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiSettings, {})
		},
		{
			name: "FiZap",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiZap, {})
		},
		{
			name: "FiAward",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiAward, {})
		},
		{
			name: "FiCommand",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCommand, {})
		},
		{
			name: "FiGlobe",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiGlobe, {})
		},
		{
			name: "FiKey",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiKey, {})
		},
		{
			name: "FiPhone",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiPhone, {})
		},
		{
			name: "FiMail",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiMail, {})
		},
		{
			name: "FiMessageCircle",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiMessageCircle, {})
		}
	];
	const getIconComponent = (iconName) => {
		const found = availableIcons.find((i) => i.name === iconName);
		return found ? found.icon : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, {});
	};
	(0, import_react.useEffect)(() => {
		if (id) loadRole();
	}, [id]);
	const loadRole = async () => {
		try {
			const role = (await listRoles()).find((r) => r.id === parseInt(id));
			if (role) {
				setFormData({
					name: role.name,
					description: role.description || "",
					color: role.color || "#4F46E5",
					icon: role.icon || "FiShield",
					level: role.level || 1,
					status: role.status === 1 || role.status === true
				});
				setSelectedPermissions(role.permissions?.map((p) => p.id) || []);
			}
		} catch {
			addNotification("Failed to load role details", "danger");
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name) {
			addNotification("Role name is required", "warning");
			return;
		}
		setLoading(true);
		try {
			const payload = {
				...formData,
				permissions: selectedPermissions
			};
			if (id) {
				await updateRole(id, payload);
				addNotification("Role updated successfully", "success");
			} else {
				await createRole(payload);
				addNotification("Role created successfully", "success");
			}
			setActiveTab("createroles");
			navigate("/admin-dashboard");
		} catch (err) {
			addNotification(err.message, "danger");
		} finally {
			setLoading(false);
		}
	};
	const handleBack = () => {
		setActiveTab("createroles");
		navigate("/admin-dashboard");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-fluid vh-100 px-0 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row h-100 g-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Common, {
				isSidebarOpen,
				setIsSidebarOpen
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-grow-1 min-w-0 ps-0 position-relative d-flex flex-column",
				style: {
					backgroundColor: "var(--background)",
					borderColor: "var(--border)",
					minHeight: 0
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopNavBar, {
					heading: id ? "Edit Role" : "Create Role",
					isSidebarOpen,
					onToggleSidebar: () => setIsSidebarOpen((prev) => !prev)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "role-form-scroll p-4 flex-grow-1 overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row justify-content-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-11",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card border-0 shadow-sm rounded-4 overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card-header bg-white border-0 py-4 px-4 d-flex align-items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 transition",
											onClick: handleBack,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiArrowLeft, {}), " Back"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vr mx-2" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
											className: "mb-0 fw-bold",
											children: id ? "Edit Role Details" : "Configure New Role"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "card-body p-4 p-md-5 pt-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleSubmit,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "row g-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-lg-7",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "mb-5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																className: "form-label fw-bold text-dark small mb-3 d-flex align-items-center gap-2",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiInfo, { className: "text-primary" }), " ROLE IDENTITY"]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "input-group input-group-lg shadow-sm rounded-4 overflow-hidden border",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "input-group-text bg-white border-0 text-muted ps-4",
																	children: getIconComponent(formData.icon)
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																	type: "text",
																	className: "form-control border-0 py-3 ps-2 shadow-none",
																	placeholder: "e.g. Lead Architect",
																	value: formData.name,
																	onChange: (e) => setFormData({
																		...formData,
																		name: e.target.value
																	}),
																	required: true
																})]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "mb-5",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																	className: "form-label fw-bold text-dark small mb-3 d-flex align-items-center gap-2",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiActivity, { className: "text-primary" }), " DESCRIPTION & STATUS"]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
																	className: "form-control border shadow-sm rounded-4 p-4 shadow-none mb-3",
																	rows: "3",
																	placeholder: "Access levels and responsibilities for this role...",
																	value: formData.description,
																	onChange: (e) => setFormData({
																		...formData,
																		description: e.target.value
																	})
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "d-flex align-items-center justify-content-between p-3 bg-light rounded-4 border",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "d-flex align-items-center gap-3",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: `p-2 rounded-circle ${formData.status ? "bg-success text-white" : "bg-secondary text-white"}`,
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiActivity, { size: 18 })
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
																			className: "mb-0 fw-bold",
																			children: "Role Status"
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																			className: "text-muted small mb-0",
																			children: formData.status ? "Active and available" : "Temporarily disabled"
																		})] })]
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "form-check form-switch form-switch-lg",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																			className: "form-check-input cursor-pointer",
																			type: "checkbox",
																			checked: formData.status,
																			onChange: (e) => setFormData({
																				...formData,
																				status: e.target.checked
																			})
																		})
																	})]
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "mb-5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																className: "form-label fw-bold text-dark small mb-3 d-flex align-items-center gap-2",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, { className: "text-primary" }), " ACCESS LEVEL"]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "p-4 bg-light rounded-4 border",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "d-flex justify-content-between mb-2",
																		children: [
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																				className: "small fw-bold text-muted",
																				children: "Base Access"
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																				className: "small fw-bold text-primary",
																				children: ["Level ", formData.level]
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																				className: "small fw-bold text-muted",
																				children: "Full Control"
																			})
																		]
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		type: "range",
																		className: "form-range custom-range",
																		min: "1",
																		max: "10",
																		step: "1",
																		value: formData.level,
																		onChange: (e) => setFormData({
																			...formData,
																			level: parseInt(e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "d-flex justify-content-between mt-2",
																		children: [
																			1,
																			2,
																			3,
																			4,
																			5,
																			6,
																			7,
																			8,
																			9,
																			10
																		].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: `small ${formData.level === l ? "fw-bold text-primary" : "text-muted"}`,
																			style: { fontSize: "10px" },
																			children: l
																		}, l))
																	})
																]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "row g-4 mb-5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "col-md-6",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																	className: "form-label fw-bold text-dark small mb-3",
																	children: "BRAND COLOR"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "p-4 rounded-4 bg-light border",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "d-grid gap-3",
																		style: { gridTemplateColumns: "repeat(4, 1fr)" },
																		children: colors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																			type: "button",
																			className: `rounded-circle border-0 transition-all ${formData.color === c ? "ring-primary" : "hover-scale"}`,
																			style: {
																				backgroundColor: c,
																				width: "32px",
																				height: "32px",
																				boxShadow: formData.color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none"
																			},
																			onClick: () => setFormData({
																				...formData,
																				color: c
																			})
																		}, c))
																	})
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "col-md-6",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																	className: "form-label fw-bold text-dark small mb-3",
																	children: "ROLE ICON"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "p-4 rounded-4 bg-light border overflow-auto",
																	style: { maxHeight: "140px" },
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "d-grid gap-3",
																		style: { gridTemplateColumns: "repeat(4, 1fr)" },
																		children: availableIcons.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																			type: "button",
																			className: `btn btn-sm rounded-3 transition-all ${formData.icon === item.name ? "btn-primary shadow" : "btn-white border"}`,
																			style: {
																				width: "36px",
																				height: "36px",
																				display: "flex",
																				alignItems: "center",
																				justifyContent: "center"
																			},
																			onClick: () => setFormData({
																				...formData,
																				icon: item.name
																			}),
																			children: item.icon
																		}, item.name))
																	})
																})]
															})]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "col-lg-5 ps-lg-5 border-start",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "sticky-top",
														style: {
															top: "20px",
															zIndex: 1
														},
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																className: "form-label fw-bold text-dark small mb-4 text-uppercase tracking-wider",
																children: "Live Preview"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "card border-0 shadow-lg rounded-4 overflow-hidden mb-5 transition-all",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "card-body p-0",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "p-4",
																		style: { backgroundColor: formData.color },
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "d-flex justify-content-between align-items-start",
																			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																				className: "p-3 bg-white bg-opacity-25 rounded-4 text-white",
																				children: import_react.cloneElement(getIconComponent(formData.icon), { size: 32 })
																			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																				className: "badge bg-white text-dark rounded-pill px-3 py-2 fw-bold shadow-sm",
																				children: ["LVL ", formData.level]
																			})]
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "mt-4",
																			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
																				className: "text-white fw-bold mb-1",
																				children: formData.name || "Role Name"
																			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																				className: "text-white text-opacity-75 small mb-0",
																				children: "System Authority Level"
																			})]
																		})]
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "p-4 bg-white",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																			className: "text-muted small mb-4",
																			children: formData.description || "Provide a description to see it here..."
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "d-flex align-items-center justify-content-between",
																			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																				className: "d-flex align-items-center gap-2",
																				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																					className: `rounded-circle ${formData.status ? "bg-success" : "bg-secondary"}`,
																					style: {
																						width: "10px",
																						height: "10px"
																					}
																				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																					className: "small fw-bold",
																					children: formData.status ? "Active Role" : "Inactive"
																				})]
																			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiShield, {
																				className: "text-light",
																				size: 24
																			})]
																		})]
																	})]
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "p-4 rounded-4 bg-primary-subtle border-0",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
																	className: "fw-bold text-primary mb-3",
																	children: "Pro Tips"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
																	className: "list-unstyled small text-primary d-flex flex-column gap-3 mb-0",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
																			className: "d-flex gap-2",
																			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCheckCircle, { className: "mt-1 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Use colors to group similar departments (e.g., Blue for Tech, Pink for HR)." })]
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
																			className: "d-flex gap-2",
																			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCheckCircle, { className: "mt-1 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Access level 10 gives full administrative privileges across all modules." })]
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
																			className: "d-flex gap-2",
																			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiCheckCircle, { className: "mt-1 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Icons help users identify roles quickly in member lists and chat sessions." })]
																		})
																	]
																})]
															})
														]
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-5 opacity-10" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex justify-content-between align-items-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-2 text-muted small",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiActivity, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Last updated: ", (/* @__PURE__ */ new Date()).toLocaleDateString()] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "d-flex gap-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "submit",
														className: "btn btn-primary px-5 py-3 rounded-pill shadow-lg d-flex align-items-center gap-2 fw-bold transition-all hover-scale",
														disabled: loading,
														children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner-border spinner-border-sm" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiSave, {}),
															" ",
															id ? "Update Role Settings" : "Initialize New Role"
														] })
													})
												})]
											})
										]
									})
								})]
							})
						})
					})
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .cursor-pointer { cursor: pointer; }
        .transition { transition: all 0.2s; }
        .transition-all { transition: all 0.3s ease-in-out; }
        .hover-scale:hover { transform: scale(1.1); }
        .ring-primary { box-shadow: 0 0 0 2px white, 0 0 0 4px #4F46E5 !important; transform: scale(1.2); }
        
        .custom-range::-webkit-slider-thumb {
            background: #4F46E5;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }
        .custom-range::-moz-range-thumb {
            background: #4F46E5;
            border: 2px solid white;
        }
        
        .form-switch-lg .form-check-input {
            width: 3.5rem;
            height: 1.75rem;
        }
        
        .tracking-wider { letter-spacing: 0.1em; }
        .btn-white { background: white; color: #64748b; }
        .btn-white:hover { background: #f8fafc; color: #4F46E5; }
      ` } })]
	});
};
//#endregion
export { AddRole as default };
