import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ai as faHandSparkles, Al as client, Ar as faFileAlt, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Dr as faEyeSlash, Er as faEye, Lc as faUser, P as faArrowLeft, _c as faTrash, _r as faEnvelope, ba as faLock, bl as useApp, hs as faShieldAlt, jn as faCloudUploadAlt, kl as clearCache, ni as faFingerprint, ru as require_react, vl as FontAwesomeIcon, xc as faTriangleExclamation } from "./ai-BHgPkVLC.js";
import { F as updateUser } from "./superadmin-Cn5Mt1aQ.js";
//#region src/pages/user/AddUser.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AddUser = () => {
	const { theme, setActiveTab, editUser, setEditUser, confirmDialog, addNotification } = useApp();
	const fileInputRef = (0, import_react.useRef)(null);
	const docInputRef = (0, import_react.useRef)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		first_name: "",
		last_name: "",
		organization: "",
		city: "",
		country: "",
		avatar: "",
		email: "",
		empId: "",
		password: "",
		role: "Admin",
		role_id: ""
	});
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [previewImage, setPreviewImage] = (0, import_react.useState)(null);
	const [avatarFile, setAvatarFile] = (0, import_react.useState)(null);
	const [documents, setDocuments] = (0, import_react.useState)([]);
	const [docLoading, setDocLoading] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [dbRoles, setDbRoles] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		fetchRoles();
	}, []);
	const fetchRoles = async () => {
		try {
			const res = await client.get("/roles");
			setDbRoles(res.data.data);
			if (!editUser && res.data.data.length > 0) {
				const adminRole = res.data.data.find((r) => r.name === "Admin") || res.data.data[0];
				setFormData((prev) => ({
					...prev,
					role: adminRole.name,
					role_id: adminRole.id
				}));
			}
		} catch (err) {
			console.error("Failed to fetch roles", err);
		}
	};
	const roles = [
		"Admin",
		"HR",
		"Manager",
		"Employee"
	];
	const makeAvatar = (label, seed, bg = "#4f46e5", accent = "#a5b4fc") => {
		const initials = label.split(/\s+/).map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase();
		const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${accent}"/></linearGradient>
          <filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0f172a" flood-opacity=".18"/></filter>
        </defs>
        <rect width="120" height="120" rx="28" fill="url(#g)"/>
        <circle cx="60" cy="52" r="30" fill="${seed % 2 === 0 ? "#f8c6a8" : "#f3b58f"}" filter="url(#s)"/>
        <path d="M31 53c4-28 50-37 61-8-13-6-37-10-61 8Z" fill="${[
			"#111827",
			"#7c2d12",
			"#374151",
			"#1e3a8a",
			"#581c87"
		][seed % 5]}"/>
        <circle cx="49" cy="56" r="3" fill="#0f172a"/><circle cx="71" cy="56" r="3" fill="#0f172a"/>
        <path d="M49 72c7 6 16 6 23 0" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M23 112c5-24 22-37 37-37s32 13 37 37" fill="rgba(255,255,255,.92)"/>
        <circle cx="92" cy="27" r="15" fill="rgba(255,255,255,.92)"/>
        <text x="92" y="32" text-anchor="middle" font-size="13" font-weight="800" font-family="Arial" fill="${bg}">${initials}</text>
      </svg>`;
		return {
			label,
			url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
		};
	};
	const presetAvatars = [
		{
			label: "User 1",
			url: "https://i.pravatar.cc/150?u=1"
		},
		{
			label: "User 2",
			url: "https://i.pravatar.cc/150?u=2"
		},
		{
			label: "User 3",
			url: "https://i.pravatar.cc/150?u=3"
		},
		{
			label: "User 4",
			url: "https://i.pravatar.cc/150?u=4"
		},
		{
			label: "User 5",
			url: "https://i.pravatar.cc/150?u=5"
		},
		{
			label: "User 6",
			url: "https://i.pravatar.cc/150?u=6"
		},
		{
			label: "User 7",
			url: "https://i.pravatar.cc/150?u=7"
		},
		{
			label: "User 8",
			url: "https://i.pravatar.cc/150?u=8"
		},
		{
			label: "User 9",
			url: "https://i.pravatar.cc/150?u=9"
		},
		{
			label: "User 10",
			url: "https://i.pravatar.cc/150?u=10"
		},
		{
			label: "User 11",
			url: "https://i.pravatar.cc/150?u=11"
		},
		{
			label: "User 12",
			url: "https://i.pravatar.cc/150?u=12"
		},
		{
			label: "User 13",
			url: "https://i.pravatar.cc/150?u=13"
		},
		{
			label: "User 14",
			url: "https://i.pravatar.cc/150?u=14"
		},
		{
			label: "User 15",
			url: "https://i.pravatar.cc/150?u=15"
		},
		{
			label: "User 16",
			url: "https://i.pravatar.cc/150?u=16"
		},
		{
			label: "User 17",
			url: "https://i.pravatar.cc/150?u=17"
		},
		{
			label: "User 18",
			url: "https://i.pravatar.cc/150?u=18"
		},
		{
			label: "User 19",
			url: "https://i.pravatar.cc/150?u=19"
		},
		{
			label: "User 20",
			url: "https://i.pravatar.cc/150?u=20"
		},
		{
			label: "User 21",
			url: "https://i.pravatar.cc/150?u=21"
		},
		{
			label: "User 22",
			url: "https://i.pravatar.cc/150?u=22"
		},
		{
			label: "User 23",
			url: "https://i.pravatar.cc/150?u=23"
		},
		{
			label: "User 24",
			url: "https://i.pravatar.cc/150?u=24"
		},
		{
			label: "User 25",
			url: "https://i.pravatar.cc/150?u=25"
		},
		{
			label: "User 26",
			url: "https://i.pravatar.cc/150?u=26"
		},
		{
			label: "User 27",
			url: "https://i.pravatar.cc/150?u=27"
		},
		{
			label: "User 28",
			url: "https://i.pravatar.cc/150?u=28"
		},
		{
			label: "User 29",
			url: "https://i.pravatar.cc/150?u=29"
		},
		{
			label: "User 30",
			url: "https://i.pravatar.cc/150?u=30"
		},
		{
			label: "User 31",
			url: "https://i.pravatar.cc/150?u=31"
		},
		{
			label: "User 32",
			url: "https://i.pravatar.cc/150?u=32"
		},
		makeAvatar("CEO", 1, "#312e81", "#06b6d4"),
		makeAvatar("Manager", 2, "#0f766e", "#34d399"),
		makeAvatar("Senior Manager", 3, "#7c3aed", "#fb7185"),
		makeAvatar("Engineer", 4, "#2563eb", "#93c5fd"),
		makeAvatar("Finance", 5, "#0f172a", "#f59e0b"),
		makeAvatar("HR", 6, "#be185d", "#f9a8d4"),
		makeAvatar("GM", 7, "#92400e", "#fde68a"),
		makeAvatar("Staff", 8, "#475569", "#cbd5e1"),
		makeAvatar("Admin", 9, "#4f46e5", "#818cf8"),
		makeAvatar("Supervisor", 10, "#0891b2", "#67e8f9"),
		makeAvatar("Analyst", 11, "#15803d", "#86efac"),
		makeAvatar("Consultant", 12, "#4338ca", "#c4b5fd")
	];
	(0, import_react.useEffect)(() => {
		if (editUser) {
			setFormData({
				first_name: editUser.first_name || "",
				last_name: editUser.last_name || "",
				organization: editUser.organization || "",
				city: editUser.city || "",
				country: editUser.country || "",
				avatar: editUser.avatar || "",
				email: editUser.email || "",
				empId: editUser.empId || "",
				password: "",
				role: editUser.role || "Admin",
				role_id: editUser.roleId || ""
			});
			if (editUser.avatar) setPreviewImage(editUser.avatar);
			loadDocuments(editUser.id);
		}
	}, [editUser]);
	const loadDocuments = async (userId) => {
		try {
			setDocuments((await client.get(`/users/${userId}/documents`)).data);
		} catch (err) {
			console.error("Failed to load documents", err);
		}
	};
	const handleDocUpload = async (e) => {
		const file = e.target.files[0];
		if (!file || !editUser) return;
		setDocLoading(true);
		const fd = new FormData();
		fd.append("file", file);
		fd.append("name", file.name);
		fd.append("type", file.type);
		try {
			await client.post(`/users/${editUser.id}/documents`, fd);
			await loadDocuments(editUser.id);
			setSuccess("Document archived successfully!");
			setTimeout(() => setSuccess(""), 3e3);
		} catch (err) {
			setError(err?.message || "Storage error. Check cloud capacity.");
		} finally {
			setDocLoading(false);
		}
	};
	const deleteDoc = async (docId) => {
		if (!await confirmDialog({
			title: "Purge Document",
			message: "Are you sure you want to permanently purge this document from archives? This action cannot be undone.",
			variant: "danger",
			confirmLabel: "Yes, Purge"
		})) return;
		try {
			await client.delete(`/user-documents/${docId}`);
			await loadDocuments(editUser.id);
		} catch (err) {
			setError("Purge failed. Protocol error.");
		}
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "role") {
			const selectedRole = dbRoles.find((r) => r.name === value);
			setFormData({
				...formData,
				role: value,
				role_id: selectedRole ? selectedRole.id : ""
			});
		} else setFormData({
			...formData,
			[name]: value
		});
	};
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				addNotification("The selected file exceeds the 5MB limit. Please choose a smaller file.", "warning", 5e3, { title: "File Too Large" });
				return;
			}
			setAvatarFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
	const selectAvatar = (url) => {
		setPreviewImage(url);
		setAvatarFile(null);
		setFormData({
			...formData,
			avatar: url
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setError("");
		try {
			const fd = new FormData();
			Object.keys(formData).forEach((key) => {
				if (formData[key] !== void 0 && formData[key] !== null) fd.append(key, formData[key]);
			});
			if (avatarFile) fd.set("avatar", avatarFile);
			else if (previewImage && previewImage.startsWith("data:image/svg")) fd.set("avatar", previewImage);
			if (editUser) {
				await updateUser(editUser.id, fd);
				setSuccess("Profile synchronized successfully!");
			} else {
				await client.post("/users", fd);
				clearCache("/users");
				setSuccess("Identity provisioned successfully!");
			}
			setTimeout(() => {
				setEditUser(null);
				setActiveTab("users");
			}, 1500);
		} catch (err) {
			setError(err?.message || "Operation failed. Review console protocols.");
		} finally {
			setSubmitting(false);
		}
	};
	const isDark = theme === "dark";
	const cardBg = isDark ? "#111827" : "#ffffff";
	const textColor = isDark ? "#f8fafc" : "#111827";
	const borderColor = isDark ? "#1f2937" : "#e5e7eb";
	const glassBg = isDark ? "rgba(255,255,255,0.02)" : "rgba(15, 23, 42, 0.02)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "premium-add-user fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workflow-header d-flex rounded-5 align-items-center justify-content-between p-4 mb-4",
				style: {
					background: cardBg,
					borderBottom: `1px solid ${borderColor}`
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "back-btn-premium d-flex align-items-center gap-3",
					onClick: () => {
						setEditUser(null);
						setActiveTab("users");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "icon-circle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faArrowLeft })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label d-block text-uppercase",
							children: "Backtrack"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "desc d-block fw-800",
							style: { color: textColor },
							children: "User Directory"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "header-badge d-none d-md-flex align-items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "status-dot pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "fw-900 tracking-wider text-uppercase",
						style: {
							color: textColor,
							fontSize: "0.7rem"
						},
						children: editUser ? "Modify Personnel" : "Provision Identity"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-fluid px-4",
				children: [
					success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "toast-premium-fixed success animate-slide-up shadow-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCheckCircle,
								className: "me-2"
							}),
							" ",
							success
						]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "toast-premium-fixed error animate-slide-up shadow-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faTriangleExclamation,
								className: "me-2"
							}),
							" ",
							error
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "row g-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "premium-card-pro h-100",
								style: {
									background: cardBg,
									border: `1px solid ${borderColor}`
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "section-title-pro mb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "step-tag",
												children: "Step 01"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
												className: "fw-900 mt-2",
												style: { color: textColor },
												children: "Media Presence"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "avatar-stage text-center mb-5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "avatar-preview-container mx-auto",
												style: {
													position: "relative",
													width: "160px",
													height: "160px"
												},
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "avatar-halo shadow-lg m-auto",
														style: { borderColor },
														children: previewImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src: previewImage,
															alt: "Preview",
															className: "img-fluid rounded-custom"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "placeholder-pro d-flex flex-column align-items-center justify-content-center h-100 opacity-25",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faUser,
																size: "3x"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "mt-2 extra-small fw-800",
																children: "NO MEDIA"
															})]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: "upload-btn-floating shadow-lg",
														onClick: () => fileInputRef.current.click(),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCloudUploadAlt })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "file",
														ref: fileInputRef,
														className: "d-none",
														accept: "image/*",
														onChange: handleFileChange
													})
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "preset-gallery p-3 rounded-4",
											style: { background: glassBg },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "d-flex justify-content-between align-items-center mb-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "extra-small fw-900 text-muted text-uppercase",
													children: "System Presets"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "gallery-grid-pro",
												children: presetAvatars.map((av, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `gallery-item-pro ${previewImage === av.url ? "active" : ""}`,
													onClick: () => selectAvatar(av.url),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: av.url,
														alt: av.label
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "hover-overlay",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faHandSparkles })
													})]
												}, idx))
											})]
										}),
										editUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-5 pt-4 border-top",
											style: { borderColor },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex justify-content-between align-items-center mb-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
														className: "fw-900 mb-0 small",
														style: { color: textColor },
														children: "PERSONNEL ARCHIVES"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: "btn-add-mini shadow-sm",
														onClick: () => docInputRef.current.click(),
														disabled: docLoading,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "file",
														ref: docInputRef,
														className: "d-none",
														onChange: handleDocUpload
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "doc-list-pro",
												children: documents.length > 0 ? documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "doc-item-pro d-flex align-items-center justify-content-between p-3 rounded-3 mb-2",
													style: { background: glassBg },
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex align-items-center gap-3 overflow-hidden",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "doc-icon-wrapper rounded-2 bg-primary text-white d-flex align-items-center justify-content-center",
															style: {
																width: 32,
																height: 32
															},
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faFileAlt,
																size: "xs"
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "extra-small fw-800 text-truncate",
															style: { color: textColor },
															children: doc.name
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: "btn-delete-mini text-danger",
														onClick: () => deleteDoc(doc.id),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
													})]
												}, doc.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-center py-4 opacity-50",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faFileAlt,
														className: "mb-2"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "extra-small fw-800 mb-0",
														children: "NO ARCHIVES FOUND"
													})]
												})
											})]
										})
									]
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "premium-card-pro",
								style: {
									background: cardBg,
									border: `1px solid ${borderColor}`
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "section-title-pro mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "step-tag",
											children: "Step 02"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											className: "fw-900 mt-2",
											style: { color: textColor },
											children: "Identity Parameters"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "data-form-pro",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "form-group-pro mb-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "group-header mb-3 pb-2 border-bottom d-flex align-items-center gap-2",
													style: { borderColor },
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faUser,
														className: "text-primary small"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "extra-small fw-900 text-muted text-uppercase",
														children: "Personnel Detail"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "row g-3",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "col-md-6",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "input-field-pro",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																	style: { color: textColor },
																	children: "First Name"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "input-box-pro",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																		icon: faUser,
																		className: "icon"
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		name: "first_name",
																		value: formData.first_name,
																		onChange: handleChange,
																		required: true,
																		placeholder: "John",
																		style: {
																			color: textColor,
																			background: isDark ? "#0a0f1a" : "#f9fafb",
																			borderColor
																		}
																	})]
																})]
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "col-md-6",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "input-field-pro",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																	style: { color: textColor },
																	children: "Last Name"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "input-box-pro",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																		icon: faUser,
																		className: "icon"
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		name: "last_name",
																		value: formData.last_name,
																		onChange: handleChange,
																		required: true,
																		placeholder: "Doe",
																		style: {
																			color: textColor,
																			background: isDark ? "#0a0f1a" : "#f9fafb",
																			borderColor
																		}
																	})]
																})]
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "col-12",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "input-field-pro",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																	style: { color: textColor },
																	children: "Corporate Email"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "input-box-pro",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																		icon: faEnvelope,
																		className: "icon"
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		type: "email",
																		name: "email",
																		value: formData.email,
																		onChange: handleChange,
																		required: true,
																		placeholder: "j.doe@company.com",
																		style: {
																			color: textColor,
																			background: isDark ? "#0a0f1a" : "#f9fafb",
																			borderColor
																		}
																	})]
																})]
															})
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "form-group-pro mb-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "group-header mb-3 pb-2 border-bottom d-flex align-items-center gap-2",
													style: { borderColor },
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faBuilding,
														className: "text-warning small"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "extra-small fw-900 text-muted text-uppercase",
														children: "Organizational Context"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "row g-3",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "col-md-6",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "input-field-pro",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																	style: { color: textColor },
																	children: "Organization"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "input-box-pro",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																		icon: faBuilding,
																		className: "icon"
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		name: "organization",
																		value: formData.organization,
																		onChange: handleChange,
																		placeholder: "Corp X",
																		style: {
																			color: textColor,
																			background: isDark ? "#0a0f1a" : "#f9fafb",
																			borderColor
																		}
																	})]
																})]
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "col-md-6",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "input-field-pro",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																	style: { color: textColor },
																	children: "Personnel ID"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "input-box-pro",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																		icon: faFingerprint,
																		className: "icon"
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		name: "empId",
																		value: formData.empId,
																		onChange: handleChange,
																		required: true,
																		placeholder: "EMP-001",
																		style: {
																			color: textColor,
																			background: isDark ? "#0a0f1a" : "#f9fafb",
																			borderColor
																		}
																	})]
																})]
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "col-md-6",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "input-field-pro",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																	style: { color: textColor },
																	children: "Clearance Level"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "input-box-pro",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																		icon: faShieldAlt,
																		className: "icon"
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
																		name: "role",
																		value: formData.role,
																		onChange: handleChange,
																		style: {
																			color: textColor,
																			background: isDark ? "#0a0f1a" : "#f9fafb",
																			borderColor
																		},
																		children: dbRoles.length > 0 ? dbRoles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																			value: r.name,
																			children: r.name
																		}, r.id)) : roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																			value: r,
																			children: r
																		}, r))
																	})]
																})]
															})
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "form-group-pro mb-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "group-header mb-3 pb-2 border-bottom d-flex align-items-center gap-2",
													style: { borderColor },
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faLock,
														className: "text-danger small"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "extra-small fw-900 text-muted text-uppercase",
														children: "Security Parameter"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "input-field-pro",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														style: { color: textColor },
														children: ["Access Key ", editUser && "(Unchanged if empty)"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "input-box-pro",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faLock,
																className: "icon"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																type: showPassword ? "text" : "password",
																name: "password",
																value: formData.password,
																onChange: handleChange,
																required: !editUser,
																placeholder: "••••••••",
																style: {
																	color: textColor,
																	background: isDark ? "#0a0f1a" : "#f9fafb",
																	borderColor
																}
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																className: "pass-toggle-btn",
																onClick: () => setShowPassword(!showPassword),
																style: { color: textColor },
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: showPassword ? faEyeSlash : faEye })
															})
														]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "action-footer-pro pt-4 border-top d-flex justify-content-end gap-3",
												style: { borderColor },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "btn-cancel-premium",
													onClick: () => setActiveTab("users"),
													children: "Cancel Protocol"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "submit",
													className: "btn-save-premium shadow-lg",
													disabled: submitting,
													children: [submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner-border spinner-border-sm me-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faCheckCircle,
														className: "me-2"
													}), editUser ? "Commit Synchronization" : "Provision Identity"]
												})]
											})
										]
									})]
								})
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .premium-add-user { font-family: 'Inter', sans-serif; min-height: 100vh; padding-bottom: 4rem; }
        .fw-800 { font-weight: 800; }
        .fw-900 { font-weight: 900; }
        .extra-small { font-size: 0.7rem; }
        .tracking-wider { letter-spacing: 1px; }

        .back-btn-premium { background: none; border: none; padding: 0; transition: 0.2s; }
        .back-btn-premium:hover { transform: translateX(-5px); }
        .icon-circle { width: 40px; height: 40px; background: rgba(99, 102, 241, 0.1); color: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .back-btn-premium .label { font-size: 0.65rem; color: #94a3b8; font-weight: 900; }

        .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

        .premium-card-pro { border-radius: 32px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
        .step-tag { display: inline-block; padding: 4px 12px; background: #6366f1; color: #fff; font-size: 0.65rem; font-weight: 900; border-radius: 8px; text-transform: uppercase; }

        .avatar-halo { width: 160px; height: 160px; border-radius: 48px; border: 4px solid #fff; overflow: hidden; background: #f3f4f6; }
        .rounded-custom { border-radius: 44px; width: 100%; height: 100%; object-fit: cover; }
        .upload-btn-floating { position: absolute; bottom: 0px; right: 0px; width: 42px; height: 42px; background: #6366f1; color: #fff; border: none; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; z-index: 10; }
        .upload-btn-floating:hover { transform: scale(1.08); background: #4f46e5; }

        .gallery-grid-pro { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .gallery-item-pro { position: relative; aspect-ratio: 1; border-radius: 14px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: 0.2s; }
        .gallery-item-pro.active { border-color: #6366f1; transform: scale(1.05); }
        .gallery-item-pro img { width: 100%; height: 100%; object-fit: cover; }
        .hover-overlay { position: absolute; inset: 0; background: rgba(99, 102, 241, 0.8); color: #fff; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; }
        .gallery-item-pro:hover .hover-overlay { opacity: 1; }

        .input-field-pro label { display: block; font-size: 0.75rem; font-weight: 800; margin-bottom: 0.5rem; }
        .input-box-pro { position: relative; }
        .input-box-pro .icon { position: absolute; left: 1.25rem; top: 1.15rem; color: #94a3b8; font-size: 0.9rem; }
        .input-box-pro input, .input-box-pro select { width: 100%; height: 3.5rem; border-radius: 16px; border: 1.5px solid transparent; padding-left: 3rem; padding-right: 1rem; font-weight: 600; font-size: 0.9rem; transition: 0.2s; }
        .input-box-pro input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.1); }
        .pass-toggle-btn { position: absolute; right: 1rem; top: 1.1rem; border: none; background: none; }

        .btn-cancel-premium { background: none; border: 1.5px solid #e5e7eb; padding: 0.85rem 2rem; border-radius: 16px; font-weight: 800; color: #64748b; font-size: 0.85rem; }
        .btn-save-premium { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #fff; border: none; padding: 0.85rem 2.5rem; border-radius: 16px; font-weight: 800; font-size: 0.85rem; transition: 0.3s; }
        .btn-save-premium:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4); }

        .btn-add-mini { width: 32px; height: 32px; border-radius: 10px; background: #6366f1; color: #fff; border: none; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
        .btn-delete-mini { background: none; border: none; padding: 4px; transition: 0.2s; }
        .btn-delete-mini:hover { transform: scale(1.1); }
        .doc-item-pro:hover { filter: brightness(0.95); }

        .toast-premium-fixed { position: fixed; bottom: 2rem; right: 2rem; padding: 1.25rem 2.5rem; border-radius: 24px; color: #fff; font-weight: 900; z-index: 1000; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .toast-premium-fixed.success { background: #0f172a; }
        .toast-premium-fixed.error { background: #ef4444; }

        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      ` })
		]
	});
};
//#endregion
export { AddUser as default };
